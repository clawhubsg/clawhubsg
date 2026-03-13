/* @vitest-environment node */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { internal } from '../_generated/api'
import { requireGitHubAccountAge, syncGitHubProfile } from './githubAccount'

vi.mock('../_generated/api', () => ({
  internal: {
    githubIdentity: {
      getGitHubProviderAccountIdInternal: Symbol('getGitHubProviderAccountIdInternal'),
    },
    users: {
      getByIdInternal: Symbol('getByIdInternal'),
      setGitHubCreatedAtInternal: Symbol('setGitHubCreatedAtInternal'),
      syncGitHubProfileInternal: Symbol('syncGitHubProfileInternal'),
    },
  },
}))

const ONE_DAY_MS = 24 * 60 * 60 * 1000

describe('requireGitHubAccountAge', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses cached githubCreatedAt when present', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-02-02T12:00:00Z')
    vi.setSystemTime(now)

    const runQuery = vi.fn().mockResolvedValue({
      _id: 'users:1',
      githubCreatedAt: now.getTime() - 20 * ONE_DAY_MS,
    })
    await requireGitHubAccountAge({ runQuery } as never, 'users:1' as never)

    expect(runQuery).toHaveBeenCalledWith(internal.users.getByIdInternal, { userId: 'users:1' })
  })

  it('rejects deactivated users', async () => {
    const runQuery = vi.fn().mockResolvedValue({
      _id: 'users:1',
      deactivatedAt: Date.now(),
    })

    await expect(
      requireGitHubAccountAge({ runQuery } as never, 'users:1' as never),
    ).rejects.toThrow(/User not found/i)
  })

  it('rejects accounts younger than 14 days', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-02-02T12:00:00Z')
    vi.setSystemTime(now)

    const runQuery = vi.fn().mockResolvedValue({
      _id: 'users:1',
      githubCreatedAt: now.getTime() - 2 * ONE_DAY_MS,
    })
    await expect(
      requireGitHubAccountAge({ runQuery } as never, 'users:1' as never),
    ).rejects.toThrow(/GitHub account must be at least 14 days old/i)
  })

  it('rejects when githubCreatedAt is not populated yet', async () => {
    const runQuery = vi.fn().mockResolvedValue({
      _id: 'users:1',
      githubCreatedAt: undefined,
    })

    await expect(
      requireGitHubAccountAge({ runQuery } as never, 'users:1' as never),
    ).rejects.toThrow(/verification still in progress/i)
  })
})

describe('syncGitHubProfile', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('skips recent syncs (throttle)', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-02-02T12:00:00Z')
    vi.setSystemTime(now)

    const runQuery = vi.fn()
      .mockResolvedValueOnce({
        _id: 'users:1',
        name: 'oldname',
        githubProfileSyncedAt: now.getTime(),
      })
    const runMutation = vi.fn()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await syncGitHubProfile({ runQuery, runMutation } as never, 'users:1' as never)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(runMutation).not.toHaveBeenCalled()
  })

  it('updates profile even when only avatar changes', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-02-02T12:00:00Z')
    vi.setSystemTime(now)

    const runQuery = vi.fn()
      .mockResolvedValueOnce({
        _id: 'users:1',
        name: 'same',
        image: 'https://avatars.githubusercontent.com/u/1?v=3',
        githubProfileSyncedAt: now.getTime() - 10 * ONE_DAY_MS,
      })
      .mockResolvedValueOnce('12345')
    const runMutation = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        login: 'same',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        created_at: '2020-01-01T00:00:00Z',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await syncGitHubProfile({ runQuery, runMutation } as never, 'users:1' as never)

    expect(runMutation).toHaveBeenNthCalledWith(1, internal.users.syncGitHubProfileInternal, {
      userId: 'users:1',
      name: 'same',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
      syncedAt: now.getTime(),
    })
    expect(runMutation).toHaveBeenNthCalledWith(2, internal.users.setGitHubCreatedAtInternal, {
      userId: 'users:1',
      githubCreatedAt: Date.parse('2020-01-01T00:00:00Z'),
    })
  })

  it('updates name and records sync timestamp', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-02-02T12:00:00Z')
    vi.setSystemTime(now)

    const runQuery = vi.fn()
      .mockResolvedValueOnce({
        _id: 'users:1',
        name: 'old',
        githubProfileSyncedAt: now.getTime() - 10 * ONE_DAY_MS,
      })
      .mockResolvedValueOnce('12345')
    const runMutation = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        login: 'new',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=1',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await syncGitHubProfile({ runQuery, runMutation } as never, 'users:1' as never)

    expect(runMutation).toHaveBeenCalledWith(internal.users.syncGitHubProfileInternal, {
      userId: 'users:1',
      name: 'new',
      image: 'https://avatars.githubusercontent.com/u/1?v=1',
      syncedAt: now.getTime(),
    })
  })

  it('forwards GitHub profile name (full name) when present', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-02-02T12:00:00Z')
    vi.setSystemTime(now)

    const runQuery = vi.fn()
      .mockResolvedValueOnce({
        _id: 'users:1',
        name: 'same',
        githubProfileSyncedAt: now.getTime() - 10 * ONE_DAY_MS,
      })
      .mockResolvedValueOnce('12345')
    const runMutation = vi.fn()
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        login: 'same',
        name: 'Real Name',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=1',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await syncGitHubProfile({ runQuery, runMutation } as never, 'users:1' as never)

    expect(runMutation).toHaveBeenCalledWith(internal.users.syncGitHubProfileInternal, {
      userId: 'users:1',
      name: 'same',
      image: 'https://avatars.githubusercontent.com/u/1?v=1',
      profileName: 'Real Name',
      syncedAt: now.getTime(),
    })
  })
})

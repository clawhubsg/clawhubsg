# `clawhubsg`

ClawHubSG CLI — install, update, search, and publish agent skills as folders.

## Install

```bash
npx clawhubsg --help
# or
npm i -g clawhubsg
```

## Auth (publish)

```bash
clawhubsg login
# or
clawhubsg auth login

# Headless / token paste
# or (token paste / headless)
clawhubsg login --token clh_...
```

Notes:

- Browser login opens `https://clawhubsg.com/cli/auth` and completes via a loopback callback.
- Token stored in `~/Library/Application Support/clawhubsg/config.json` on macOS (override via `CLAWHUBSG_CONFIG_PATH`; legacy `CLAWHUB_CONFIG_PATH` and `CLAWDHUB_CONFIG_PATH` still work).

## Examples

```bash
clawhubsg search "postgres backups"
clawhubsg install my-skill-pack
clawhubsg update --all
clawhubsg update --all --no-input --force
clawhubsg publish ./my-skill-pack --slug my-skill-pack --name "My Skill Pack" --version 1.2.0 --changelog "Fixes + docs"
```

## Sync (upload local skills)

```bash
# Start anywhere; scans workdir first, then legacy Clawdis/Clawd/OpenClaw/Moltbot locations.
clawhubsg sync

# Explicit roots + non-interactive dry-run
clawhubsg sync --root ../clawdis/skills --all --dry-run
```

## Defaults

- Site: `https://clawhubsg.com` (override via `--site` or `CLAWHUBSG_SITE`; legacy `CLAWHUB_SITE` and `CLAWDHUB_SITE` still work)
- Registry: discovered from `/.well-known/clawhub.json` on the site (legacy `/.well-known/clawdhub.json`; override via `--registry` or `CLAWHUBSG_REGISTRY`)
- Workdir: current directory (falls back to Clawdbot workspace if configured; override via `--workdir` or `CLAWHUBSG_WORKDIR`)
- Install dir: `./skills` under workdir (override via `--dir`)

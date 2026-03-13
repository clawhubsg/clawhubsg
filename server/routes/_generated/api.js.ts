import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const filePath = join(process.cwd(), 'convex', '_generated', 'api.js')
  const source = await readFile(filePath, 'utf8')

  setHeader(event, 'Content-Type', 'text/javascript; charset=utf-8')
  return source
})

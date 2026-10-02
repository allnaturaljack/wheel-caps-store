// Runs a project-local PostgreSQL for development. Data lives in ./data.
// Local-only credentials; production uses its own DATABASE_URL.
import EmbeddedPostgres from "embedded-postgres"
import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const dataDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "data")
const port = Number(process.env.PGPORT ?? 5432)
const databases = ["medusa_wheel_caps"]

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port,
  persistent: true,
})

if (!existsSync(path.join(dataDir, "PG_VERSION"))) {
  await pg.initialise()
}
await pg.start()

const client = pg.getPgClient()
await client.connect()
for (const name of databases) {
  const { rowCount } = await client.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [name]
  )
  if (!rowCount) {
    await pg.createDatabase(name)
  }
}
await client.end()

console.log(`Postgres ready on localhost:${port} (databases: ${databases.join(", ")})`)

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)

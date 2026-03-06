touch data/data.db
bunx --bun drizzle-kit generate --dialect sqlite --schema ./schema.ts
bun run migrate.ts
bun run seed.ts

import type { Config } from 'drizzle-kit'

export default {
  schema: './schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `${Bun.env.DB_URL}`
  },
} satisfies Config

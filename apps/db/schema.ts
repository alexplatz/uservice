import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(Bun.randomUUIDv7),
  username: text('username'),
})

export const magicTokens = sqliteTable('magicTokens', {
  id: text('id').notNull().primaryKey().$defaultFn(Bun.randomUUIDv7),
  tokenHash: text('tokenHash').notNull().unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
  email: text('email').notNull().unique().references(() => emails.email),
  userId: text('userId').notNull().references(() => users.id)
})

export const otps = sqliteTable('otps', {
  id: text('id').notNull().primaryKey().$defaultFn(Bun.randomUUIDv7),
  otpHash: text('otpHash').unique(),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
  expiresAt: integer('expiresAt', { mode: 'timestamp' }),
  email: text('email').notNull().unique().references(() => emails.email),
  userId: text('userId').notNull().references(() => users.id)
})

export const challenges = sqliteTable('challenges', {
  id: text('id').notNull().primaryKey(),
  challenge: text('challenge').notNull(),
})

export const credentials = sqliteTable('credentials', {
  id: text('id').notNull().primaryKey(),
  publicKey: text('publicKey').notNull(),
  algorithm: integer('algorithm').notNull(),
  transports: text('transports', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .default(sql`'[]'`),
  userId: text('userId').notNull().references(() => users.id)
})

export const emails = sqliteTable('emails', {
  id: text('id').notNull().primaryKey().$defaultFn(Bun.randomUUIDv7),
  email: text('email').notNull().unique(),
  isPrimary: integer('isPrimary', { mode: 'boolean' }).notNull().default(false),
  verified: integer('isPrimary', { mode: 'boolean' }).notNull().default(false),
  userId: text('userId').notNull().references(() => users.id)
})

export const sessions = sqliteTable('sessions', {
  userId: integer('userId').references(() => users.id),
  familyId: text('familyId').primaryKey().$defaultFn(Bun.randomUUIDv7),
  refreshToken: text('refreshToken'),
  lastUsed: text('lastUsed')
    .notNull()
    .default(sql`current_timestamp`)
    .$onUpdate(() => sql`current_timestamp`),
})


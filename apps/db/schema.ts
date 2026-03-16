import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(Bun.randomUUIDv7),
  username: text('username'),
  otp: text('otp').unique(),
  otpExpiresAt: integer('otpExpiresAt', { mode: 'timestamp' }),
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
  vToken: text('vToken').unique(),
  vTokenExpiresAt: integer('vTokenExpiresAt', { mode: 'timestamp' }),
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


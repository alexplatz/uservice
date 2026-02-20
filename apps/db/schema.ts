import { integer, real, sqliteTable } from "drizzle-orm/sqlite-core";

export const dataPoints = sqliteTable('dataPoints', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clientId: integer('clientId'),
  value: real('value')
})

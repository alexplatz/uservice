import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import path from "path"
import * as schema from "./schema"

// these paths should also be secrets managed
const db = drizzle(new Database("data.db"), { schema });
migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });


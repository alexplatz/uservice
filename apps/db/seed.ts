import { configure, getConsoleSink, getLogger } from "@logtape/logtape";
import { db } from "./db";
import { users, emails, credentials } from "./schema";

// if db is switched from embedded,
// delete this config and import from index
const isDevelopment = process.env.NODE_ENV === 'development'

await configure({
  sinks: {
    console: getConsoleSink(),
    // file: getFileSink(isDevelopment ? 'dev.log' : 'prod.log'),
  },
  loggers: [
    {
      category: 'template-db',
      lowestLevel: isDevelopment ? 'trace' : 'info',
      // odd formatting for symmetry across monorepo
      // in a real app, we'd log to console in dev and remote file in prod
      sinks: isDevelopment ? ['console', 'console'] : ['console'],
    },
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }
  ],
})
const logger = getLogger(["template-db", "seed"]);

const [userResult] = await db.insert(users).values([
  {
    username: 'bat',
  }
]).returning()

const [emailResult] = await db.insert(emails).values([
  {
    email: 'bat@squat.org',
    userId: userResult.id,
    isPrimary: true
  }
]).returning()

const credentialResult = await db.insert(credentials).values([
  {
    id: crypto.randomUUID(),
    publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExZ3bQ9Xa4kbrskcobWw8Drr4Facf074_o9GbN_g56L8V2IOeHxBrcNS35XQFD1VoGWiO0Aqx3QnmVst3aCz6rg==",
    algorithm: -7,
    transports: ["usb"],
    userId: userResult.id
  }
]).returning()

logger.info('seeded db with: {*}', {
  userResult,
  emailResult,
  credentialResult
})

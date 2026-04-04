import { db } from "./db";
import { users, emails, credentials } from "./schema";

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

console.log('seeded db with: ', { userResult, emailResult, credentialResult })

import { db } from "./client";
import { users, credentials } from "./schema";

const [userResult] = await db.insert(users).values([
  {
    email: 'bat@squat.org',
    username: 'bat',
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

console.log('seeded db with: ', { userResult, credentialResult })

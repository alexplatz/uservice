import { db } from "./client";
import { dataPoints } from "./schema";

const result = db.insert(dataPoints).values([
  {
    clientId: 1,
    value: .5,
  },
  {
    clientId: 2,
    value: .15,
  },
  {
    clientId: 3,
    value: .75,
  }
]).returning()

result.then(data => console.log('seeded db with: ', data))

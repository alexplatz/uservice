import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { getAll, persistValue } from '../db/client'

const meta = {
  port: 8001,
  // fetch: app.fetch,
}


// specify cors
new Elysia()
  .use(cors())

  .get('/', 'Hello World')
  .get('/data', () => getAll())

  .post('/data/:clientid/:value', async ({ params: { clientid, value } }) => {
    await persistValue(parseInt(clientid), parseInt(value))
    return { clientid, value }
  })

  .listen(meta.port)

console.log(`server started on http://localhost:${meta.port}!`)
export default meta

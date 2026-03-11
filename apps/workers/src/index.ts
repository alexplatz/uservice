import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { otp, otpShape } from './gets'

// import { logger } from '@bogeychan/elysia-logger'


const app = new Elysia()
  // .use(logger())
  .use(cors({
    origin: [`${Bun.env.CLIENT_URL!}`],
    credentials: true
  }))

  .get('/', 'Hello World')
  .get('/otp', otp, otpShape)


  .listen(Bun.env.SERVER_PORT! || 8001)

console.log(`server started on ${Bun.env.SERVER_URL!}!`)

export type App = typeof app

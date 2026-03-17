import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { challenge, challengeShape, getUserEmails, getUserEmailsShape, login, loginShape, refresh, refreshShape, register, registerShape, verifyEmail, verifyEmailShape, verifyMagicLink, verifyMagicLinkShape } from './posts'

// import { logger } from '@bogeychan/elysia-logger'


const app = new Elysia()
  // .use(logger())
  .use(cors({
    // switch to '*' for local testing
    origin: [`${Bun.env.CLIENT_URL!}`],
    credentials: true
  }))
  .use(
    jwt({
      name: 'access',
      secret: Bun.env.JWT_SECRET!,
      exp: '15m'
    })
  )
  .use(
    jwt({
      name: 'refresh',
      secret: Bun.env.JWT_SECRET!,
      exp: '1d'
    })
  )
  .get('/', 'Hello World')

  .post('/user/challenge', challenge, challengeShape)
  .post('/user/register', register, registerShape)
  .post('/user/login', login, loginShape)
  .post('/user/email/verify', verifyEmail, verifyEmailShape)
  .post('/user/verify', verifyMagicLink, verifyMagicLinkShape)
  .post('/refresh', refresh, refreshShape)
  .post('/user/emails', getUserEmails, getUserEmailsShape)

  .listen(Bun.env.SERVER_PORT! || 8001)

console.log(`server started on ${Bun.env.SERVER_URL!}!`)

export type App = typeof app

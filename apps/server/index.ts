import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { getAllUsers } from '../db/client'
import { challenge, challengeShape, login, loginShape, refresh, refreshShape, register, registerShape } from './posts'


// specify cors
const app = new Elysia()
  .use(cors({
    origin: `${Bun.env.CLIENT_URL!}`,
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
  .get('/data', getAllUsers)
  .get('/error', ({ status }) => status(401))

  .post('/user/challenge', challenge, challengeShape)

  // on refresh, create new access and refresh tokens
  .post('/user/register', register, registerShape)
  .post('/user/login', login, loginShape)
  .post('/refresh', refresh, refreshShape)

  .listen(Bun.env.SERVER_PORT! || 8001)

console.log(`server started on ${Bun.env.SERVER_URL!}!`)

export type App = typeof app

import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { bearer } from '@elysiajs/bearer'
import { challenge, challengeShape, login, loginShape, magicLinkEmail, magicLinkEmailShape, oauthLogin, oauthLoginShape, oauthRegister, oauthRegisterShape, register, registerShape, verifyEmail, verifyEmailShape, verifyMagicLink, verifyMagicLinkShape } from './posts/auth'
import { createUserEmailPost, createUserEmailShape, deleteUserEmailPost, deleteUserEmailShape, getAllUserEmailsPost, getAllUserEmailsShape, updateUserEmailPost, updateUserEmailShape } from './posts/email'
import { createUserCredentialPost, createUserCredentialShape, deleteUserCredentialPost, deleteUserCredentialShape, getAllUserCredentialsPost, getAllUserCredentialsShape, updateUserCredentialPost, updateUserCredentialShape } from './posts/credential'
import { deleteUserSessionPost, deleteUserSessionShape, getAllUserSessionsPost, getAllUserSessionsShape } from './posts/session'
import { logoutGet, logoutGetShape, refreshGet, refreshGetShape } from './gets'
import { guardJwts } from './guards'
import { rateLimit } from 'elysia-rate-limit'
import { configure, getConsoleSink, getLogger } from '@logtape/logtape'

// import { logger } from '@bogeychan/elysia-logger'

const isDevelopment = process.env.NODE_ENV === 'development'

await configure({
  sinks: {
    console: getConsoleSink(),
    // file: getFileSink(isDevelopment ? 'dev.log' : 'prod.log'),
  },
  loggers: [
    {
      category: 'template-api',
      lowestLevel: isDevelopment ? 'trace' : 'info',
      // odd formatting for symmetry across monorepo
      // in a real app, we'd log to console in dev and remote file in prod
      sinks: isDevelopment ? ['console'] : ['console'],
    },
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }
  ],
})

const logger = getLogger(["template-api", "index"]);

const app = new Elysia()
  // .use(logger())
  .use(rateLimit({
    max: 100
  }))
  .use(cors({
    // switch to '*' for local testing
    origin: [`${Bun.env.CLIENT_URL!}`],
    credentials: true
  }))
  .use(bearer())
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
  .get('/refresh', refreshGet, refreshGetShape)

  .post('/user/oauth/login', oauthLogin, oauthLoginShape)

  .post('/user/login/magic-link', magicLinkEmail, magicLinkEmailShape)
  .post('/user/email/verify', verifyEmail, verifyEmailShape)
  .post('/user/verify', verifyMagicLink, verifyMagicLinkShape)

  .guard({
    beforeHandle: ({ status, refresh, access, cookie: { auth }, bearer }) =>
      guardJwts({ status, refresh, access, cookie: { auth }, bearer })
  })

  .get('/user/logout', logoutGet, logoutGetShape)

  .post('/user/email/get/all', getAllUserEmailsPost, getAllUserEmailsShape)
  .post('/user/email/create', createUserEmailPost, createUserEmailShape)
  .post('/user/email/update', updateUserEmailPost, updateUserEmailShape)
  .post('/user/email/delete', deleteUserEmailPost, deleteUserEmailShape)

  .post('/user/credential/get/all', getAllUserCredentialsPost, getAllUserCredentialsShape)
  .post('/user/credential/create', createUserCredentialPost, createUserCredentialShape)
  .post('/user/credential/update', updateUserCredentialPost, updateUserCredentialShape)
  .post('/user/credential/delete', deleteUserCredentialPost, deleteUserCredentialShape)

  .post('/user/session/get/all', getAllUserSessionsPost, getAllUserSessionsShape)
  .post('/user/session/delete', deleteUserSessionPost, deleteUserSessionShape)

  .listen(Bun.env.SERVER_PORT! || 8001)

logger.info`server started on ${Bun.env.SERVER_URL!}!`

export type App = typeof app

import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { verificationEmail, verificationEmailShape } from './posts'
import { Queue, Worker, Job, shutdownManager } from 'bunqueue/client'
import { EmailJob } from './utils'

// import { logger } from '@bogeychan/elysia-logger'

const verificationQueue: Queue<EmailJob> = new Queue<EmailJob>('emails', { embedded: true })

const app = new Elysia()
  // .use(logger())
  .use(cors({
    origin: [`${Bun.env.SERVER_URL!}`],
  }))

  .get('/', 'Hello World')
  .post('/email/verification', verificationEmail(verificationQueue), verificationEmailShape)

  .listen(Bun.env.QUEUE_PORT! || 8002)

console.log(`server started on ${Bun.env.QUEUE_URL!}!`)

export type App = typeof app

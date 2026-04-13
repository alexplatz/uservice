import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { enqueueMagicLinkEmail, enqueueVerificationEmail, magicLinkEmailShape, verificationEmailShape } from './posts'
import { Job, Queue, shutdownManager, Worker } from 'bunqueue/client'
import { EmailJob, processMagicLinkJob, processVerificationJob } from './utils'
import { configure, getConsoleSink, getLogger } from '@logtape/logtape'

const isDevelopment = process.env.NODE_ENV === 'development'

await configure({
  sinks: {
    console: getConsoleSink(),
    // file: getFileSink(isDevelopment ? 'dev.log' : 'prod.log'),
  },
  loggers: [
    {
      category: 'template-workers',
      lowestLevel: isDevelopment ? 'trace' : 'info',
      // odd formatting for symmetry across monorepo
      // in a real app, we'd log to console in dev and remote file in prod
      sinks: isDevelopment ? ['console'] : ['console'],
    },
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }
  ],
})

const logger = getLogger(["template-workers", "index"])


logger.info`spinning up embedded queue...`
const emailQueue = new Queue<EmailJob>('email', { embedded: true })
const magicLinkQueue = new Queue<EmailJob>('magic-link', { embedded: true })

logger.info`starting embedded workers...`
const verificationWorker = new Worker<EmailJob>('email', processVerificationJob, { embedded: true })
const magicLinkWorker = new Worker<EmailJob>('magic-link', processMagicLinkJob, { embedded: true })

verificationWorker.on('completed', (job: Job<EmailJob>) => {
  logger.info`✔ Processed job ${job.id}!`
})

magicLinkWorker.on('completed', (job: Job<EmailJob>) => {
  logger.info`✔ Processed job ${job.id}!`
})


const app = new Elysia()
  .use(cors({
    // switch to '*' for local testing
    origin: [`${Bun.env.SERVER_URL!}`],
  }))

  .get('/', 'Hello World')
  .post('/email/verification', enqueueVerificationEmail(emailQueue), verificationEmailShape)
  .post('/email/magic-link', enqueueMagicLinkEmail(magicLinkQueue), magicLinkEmailShape)

  .listen(Bun.env.WORKERS_PORT! || 8002)

logger.info`server started on ${Bun.env.WORKERS_URL!}!`

process.on('SIGINT', async () => {
  logger.info`shutting down queues and workers...`
  await verificationWorker.close()
  shutdownManager()
  process.exit(0)
})

export type App = typeof app

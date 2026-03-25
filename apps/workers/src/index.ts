import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { enqueueMagicLinkEmail, enqueueVerificationEmail, magicLinkEmailShape, verificationEmailShape } from './posts'
import { Job, Queue, shutdownManager, Worker } from 'bunqueue/client'
import { EmailJob, processMagicLinkJob, processVerificationJob } from './utils'



console.log('spinning up embedded queue...')
const emailQueue = new Queue<EmailJob>('email', { embedded: true })
const magicLinkQueue = new Queue<EmailJob>('magic-link', { embedded: true })

console.log('starting embedded workers...')
const verificationWorker = new Worker<EmailJob>('email', processVerificationJob, { embedded: true })
const magicLinkWorker = new Worker<EmailJob>('magic-link', processMagicLinkJob, { embedded: true })

verificationWorker.on('completed', (job: Job<EmailJob>) => {
  console.log(`✔ Processed job ${job.id}!`)
})

magicLinkWorker.on('completed', (job: Job<EmailJob>) => {
  console.log(`✔ Processed job ${job.id}!`)
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

console.log(`server started on ${Bun.env.WORKERS_URL!}!`)

process.on('SIGINT', async () => {
  console.log('shutting down queues and workers...')
  await verificationWorker.close()
  shutdownManager()
  process.exit(0)
})

export type App = typeof app

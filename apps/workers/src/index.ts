import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { enqueueLinkEmail, linkEmailShape } from './posts'
import { Job, Queue, shutdownManager, Worker } from 'bunqueue/client'
import { EmailJob, processVerificationJob } from './utils'



console.log('spinning up embedded queue...')
const emailQueue = new Queue<EmailJob>('email', { embedded: true })

console.log('starting embedded workers...')
const verificationWorker = new Worker<EmailJob>('email', processVerificationJob, { embedded: true })

verificationWorker.on('completed', (job: Job<EmailJob>) => {
  console.log(`✔ Processed job ${job.id}!`)
})


const app = new Elysia()
  .use(cors({
    origin: [`${Bun.env.SERVER_URL!}`],
  }))

  .get('/', 'Hello World')
  .post('/email/verification', enqueueLinkEmail(emailQueue), linkEmailShape)

  .listen(Bun.env.WORKERS_PORT! || 8002)

console.log(`server started on ${Bun.env.WORKERS_URL!}!`)

process.on('SIGINT', async () => {
  console.log('shutting down queues and workers...')
  await verificationWorker.close()
  shutdownManager()
  process.exit(0)
})

export type App = typeof app

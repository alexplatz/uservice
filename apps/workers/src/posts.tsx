import * as React from 'react'

import OTPEmail from './emails/otp'

import * as nodemailer from 'nodemailer'
import { t } from 'elysia'
import { render } from '@react-email/components'
import { Queue, Worker, Job, shutdownManager } from 'bunqueue/client'
import { randomUUIDv7 } from 'bun'
import { EmailJob } from './utils'

const transporter = nodemailer.createTransport({
  host: Bun.env.EMAIL_HOST!,
  port: Bun.env.EMAIL_PORT!,
  auth: {
    user: Bun.env.EMAIL_USER!,
    pass: Bun.env.EMAIL_PASSWORD!
  }
})

const sendVerificationEmail = async (job: Job<EmailJob>) => {
  console.log(`🞷 Processing job ${job.data.id} ...`)

  await transporter.sendMail({
    from: Bun.env.EMAIL_USER!,
    to: job.to,
    subject: 'Verify your email address',
    html: job.html,
  })

  console.log('sent email')
  await job.updateProgress(100)

  return { sent: true }
}

export const verificationEmail = (queue: Queue<EmailJob>) => async ({ body: { to, otp } }) => {
  // const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

  console.log({ to, otp })
  const html = await render(<OTPEmail otp={otp} />)


  const worker: Worker<EmailJob> = new Worker<EmailJob>('emails', sendVerificationEmail, { embedded: true })

  worker.on('completed', (job: Job<EmailJob>) => {
    console.log(`✔ Processed job ${job.id}!`)
  })

  await queue.add('welcome', {
    id: randomUUIDv7(),
    to,
    otp,
    html
  })

  return { success: true }
}

export const verificationEmailShape = {
  body: t.Object({
    to: t.String({ format: 'email' }),
    otp: t.Number()
  })
}

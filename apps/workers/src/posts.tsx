import * as React from 'react'

import OTPEmail from './emails/otp'

import { t } from 'elysia'
import { render } from '@react-email/components'
import { Queue, Worker, Job, shutdownManager } from 'bunqueue/client'
import { randomUUIDv7 } from 'bun'
import { EmailJob } from './utils'
import LinkEmail from './emails/link'

// const otp = ~~(Math.random() * (900_000 - 1)) + 100_000

// Generic email enqueue function for reusability
const emailsEnqueue = async (queue: Queue<EmailJob>, to: string, html: string) => {
  const id = randomUUIDv7()
  console.log(`enqueing job ${id}`)

  await queue.add('email', {
    id,
    to,
    html
  })

  return { success: true }
}



/***** Enqueue function derivatives ******/
export const enqueueOtpEmail = (queue: Queue<EmailJob>) => async ({ body: { to, otp } }) =>
  await emailsEnqueue(queue, to, await render(<OTPEmail otp={otp} />))

export const enqueueLinkEmail = (queue: Queue<EmailJob>) => async ({ body: { to, link } }) =>
  await emailsEnqueue(queue, to, await render(<LinkEmail link={link} />))



/***** Post shapes ******/
export const otpEmailShape = {
  body: t.Object({
    to: t.String({ format: 'email' }),
    otp: t.Number()
  })
}

export const linkEmailShape = {
  body: t.Object({
    to: t.String({ format: 'email' }),
    link: t.String()
  })
}

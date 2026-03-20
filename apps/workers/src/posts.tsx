import OTPEmail from './emails/otp'

import { t } from 'elysia'
import { render } from '@react-email/components'
import { Queue } from 'bunqueue/client'
import { randomUUIDv7 } from 'bun'
import { EmailJob } from './utils'
import VerificationLinkEmail from './emails/verificationLink'
import MagicLinkEmail from './emails/magicLink'

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

export const enqueueVerificationEmail = (queue: Queue<EmailJob>) => async ({ body: { to, url } }) =>
  await emailsEnqueue(queue, to, await render(<VerificationLinkEmail link={url} />))

export const enqueueMagicLinkEmail = (queue: Queue<EmailJob>) => async ({ body: { to, url } }) =>
  await emailsEnqueue(queue, to, await render(<MagicLinkEmail link={url} />))



/***** Post shapes ******/
export const otpEmailShape = {
  body: t.Object({
    to: t.String(),
    otp: t.Number()
  })
}

export const verificationEmailShape = {
  body: t.Object({
    to: t.String(),
    url: t.String()
  })
}

export const magicLinkEmailShape = {
  body: t.Object({
    to: t.String(),
    url: t.String()
  })
}

import * as React from 'react'

import OTPEmail from './emails/otp'

import * as nodemailer from 'nodemailer'
import { t } from 'elysia'
import { render } from '@react-email/components'

const transporter = nodemailer.createTransport({
  host: Bun.env.EMAIL_HOST!,
  port: Bun.env.EMAIL_PORT!,
  auth: {
    user: Bun.env.EMAIL_USER!,
    pass: Bun.env.EMAIL_PASSWORD!
  }
})


export const otp = async ({ body }) => {
  const otp = ~~(Math.random() * (900_000 - 1)) + 100_000
  console.log({ body, otp })
  const html = await render(<OTPEmail otp={otp} />)

  await transporter.sendMail({
    from: Bun.env.EMAIL_USER!,
    to: 'test@example.com',
    subject: 'Verify your email address',
    html,
  })

  return { success: true }
}

export const otpShape = {
  body: t.String({ format: 'email' })
}

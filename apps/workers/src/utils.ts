import { Job } from "bunqueue/client";
import * as nodemailer from 'nodemailer'
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface EmailJob {
  id: string;
  to: string;
  html: string;
}

type emailProcessFn = (job: Job<EmailJob>) => Promise<SMTPTransport.SentMessageInfo>


const transporter = nodemailer.createTransport({
  host: Bun.env.EMAIL_HOST!,
  port: parseInt(Bun.env.EMAIL_PORT!),
  secure: true,
  auth: {
    user: Bun.env.EMAIL_USER!,
    pass: Bun.env.EMAIL_PASSWORD!
  }
} as SMTPTransport.Options)



/***** Generic email sender *****/
const sendEmailFn = (subject: string) => async (job: Job<EmailJob>) =>
  await transporter.sendMail({
    from: Bun.env.EMAIL_USER!,
    to: job.data.to,
    subject,
    html: job.data.html,
  })

/***** Email sender derivatives *****/
const sendVerificationEmail = sendEmailFn('Verify your email address')
const sendMagicLinkEmail = sendEmailFn('One time login link')


/***** Generic job processors *****/
const processJobFn = (processFn: emailProcessFn) => async (job: Job<EmailJob>) => {
  console.log(`🞷 Processing job ${job.data.id} ...`)

  try {
    await processFn(job)
  } catch (e) {
    // need logging
    console.log(e)
    throw (e)
  }

  await job.updateProgress(100)

  return { sent: true }
}

/***** Job processor derivatives *****/
export const processVerificationJob = processJobFn(sendVerificationEmail)
export const processMagicLinkJob = processJobFn(sendMagicLinkEmail)

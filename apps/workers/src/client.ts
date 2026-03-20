const workersUrl = Bun.env.WORKERS_URL!

// need to figure out better cert strategy
/***** generic link email enqueue function *****/
const enqueueLinkEmailServer = (serverPath: string) => (serverUrl: string) => async ({ to, url }: { to: string, url: string }) =>
  await fetch(`${serverUrl}/${serverPath}`, {
    method: "POST",
    // only for local testing
    tls: {
      rejectUnauthorized: false,
    },
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      url
    }),
  });


/***** link email enqueue function derivatives *****/
const enqueueVerificationEmailServer = enqueueLinkEmailServer('email/verification')
const enqueueMagicLinkEmailServer = enqueueLinkEmailServer('email/magic-link')



const enqueueOtpEmailServer = (serverUrl: string) => async (to: string, otp: number) =>
  await fetch(`${serverUrl}/email/otp`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      otp
    }),
  });




export const [
  enqueueVerificationEmail,
  enqueueMagicLinkEmail,
  enqueueOtpEmail
] = [
    enqueueVerificationEmailServer(workersUrl),
    enqueueMagicLinkEmailServer(workersUrl),
    enqueueOtpEmailServer(workersUrl)
  ]

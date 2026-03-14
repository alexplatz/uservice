const workersUrl = Bun.env.WORKERS_URL!

// need to figure out better cert strategy
const enqueueVerificationEmailServer = (serverUrl: string) => async (to: string, url: string) =>
  await fetch(`${serverUrl}/email/verification`, {
    method: "POST",
    // only for local testing
    // tls: {
    //   rejectUnauthorized: false,
    // },
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      url
    }),
  });

const enqueueOtpEmailServer = (serverUrl: string) => async (to: string, otp: number) =>
  await fetch(`${serverUrl}/email/otp`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      otp
    }),
  });

export const [enqueueVerificationEmail, enqueueOtpEmail] = [enqueueVerificationEmailServer(workersUrl), enqueueOtpEmailServer(workersUrl)]

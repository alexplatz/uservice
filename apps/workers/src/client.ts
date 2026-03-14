export const enqueueVerificationEmail = (to: string, url: string) =>
  new Request(`${Bun.env.WORKERS_PROXY!}/email/verification`, {
    method: "POST",
    body: JSON.stringify({
      to,
      url
    }),
  });

export const enqueueOtpEmail = (to: string, otp: number) =>
  new Request(`${Bun.env.WORKERS_PROXY!}/email/otp`, {
    method: "POST",
    body: JSON.stringify({
      to,
      otp
    }),
  });

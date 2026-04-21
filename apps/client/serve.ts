const server = Bun.serve({
  // port: Bun.env.VITE_CLIENT_URL,
  port: 3001,
  fetch: (req) => {
    const url = new URL(req.url)

    const path = url.pathname === '/' ?
      '/index.html' :
      url.pathname

    const file = Bun.file(`./dist${path}`)
    return new Response(file)
  },
});

console.log(`Listening on ${server.url}`);


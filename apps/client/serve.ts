const PUBLIC_DIR = './dist'

const server = Bun.serve({
  // port: Bun.env.VITE_CLIENT_URL,
  port: 3001,
  fetch: async (req) => {
    const url = new URL(req.url)

    const path = url.pathname === '/' ?
      '/index.html' :
      url.pathname

    const file = Bun.file(`${PUBLIC_DIR}${path}`)

    if (await file.exists()) {
      return new Response(file);
    } else {
      return new Response(`${PUBLIC_DIR}/index.html`)
    }
  },
});

console.log(`Listening on ${server.url}`);


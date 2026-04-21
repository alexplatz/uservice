/* server for serving production payloads */
/* make sure port matches app port */
/* payloads configured before server, so no env vars */

const server = Bun.serve({
  port: 3001,
  fetch: async (req) => {
    const url = new URL(req.url)
    let filePath = url.pathname

    // Default to index.html for SPAs
    if (filePath === "/") filePath = "./index.html"
    const file = Bun.file(`./dist${filePath}`)

    // Serve file from dist
    return new Response(
      await file.exists() ?
        file :
        Bun.file('./dist/index.html')
    )
  }
})

console.log(`Listening on ${server.url}`)


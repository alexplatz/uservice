import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { routeTree } from './routeTree.gen'
import { queryClient } from '@/utils/query'
import { configure, getConsoleSink } from '@logtape/logtape'

const isDevelopment = process.env.NODE_ENV === 'development'

await configure({
  sinks: {
    console: getConsoleSink(),
    // file: getFileSink(isDevelopment ? 'dev.log' : 'prod.log'),
  },
  loggers: [
    {
      category: 'template-client',
      lowestLevel: isDevelopment ? 'trace' : 'info',
      // odd formatting for symmetry across monorepo
      // in a real app, we'd log to console in dev and remote file in prod
      sinks: isDevelopment ? ['console'] : ['console'],
    },
    { category: ['logtape', 'meta'], sinks: ['console'], lowestLevel: 'warning' }
  ],
})

const router = createRouter({
  routeTree,
  context: {
    queryClient
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  )

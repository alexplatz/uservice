import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () =>
    <>
      <Outlet />
      {
        process.env.NODE_ENV === 'development' ?
          <TanStackRouterDevtools position="bottom-right" /> :
          null
      }
    </>
})


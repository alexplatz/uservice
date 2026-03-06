import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () =>
    <>
      <div className='p-2 flex gap-2'>
        <Link to="/" activeProps={{ className: 'font-bold', }}>
          Home
        </Link>{' '}
        <Link to="/about" activeProps={{ className: 'font-bold', }}>
          About
        </Link>{' '}
        <Link to="/dashboard" activeProps={{ className: 'font-bold', }} preload={false}>
          Dashboard
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
})


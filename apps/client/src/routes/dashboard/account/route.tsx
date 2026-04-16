import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { logout } from "@/api/client";
import { queryClient } from "@/utils/query";

export const Route = createFileRoute('/dashboard/account')({
  beforeLoad: async () => { },
  component: () => {
    const navigate = Route.useNavigate()
    const location = useLocation({
      select: location => location.pathname
    })
      .split('/')
      .pop()
    const username = queryClient.getQueryData(['username'])

    const title = `${username} ${location === 'account' ? 'account settings' : location}`

    return <>
      <div className="w-[calc(100vw-45px)]">
        <div className="flex justify-between justify-items-center">
          <h1 className="text-4xl italic">{title}</h1>
          <Button onClick={async () => {
            await logout()
            queryClient.setQueryData(['jwt'], '')
            navigate({
              to: "/"
            })
          }}>Logout</Button>
        </div>
        <hr className="mb-4" />
        {location === 'account' ? <p>try tapping on an item in the navbar...</p> : null}
        <Outlet />
      </div>
    </>
  }
})



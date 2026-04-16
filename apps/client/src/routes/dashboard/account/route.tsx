import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { logout } from "@/api/client";
import { queryClient } from "@/utils/query";

export const Route = createFileRoute('/dashboard/account')({
  beforeLoad: async () => { },
  component: () => {
    const navigate = Route.useNavigate()
    const username = queryClient.getQueryData(['username'])

    return <>
      <div className="min-w-[calc(100vw-4rem)] content-center">
        <div className="flex justify-between">
          <h1>{username as string} account settings</h1>
          <Button onClick={async () => {
            await logout()
            queryClient.setQueryData(['jwt'], '')
            navigate({
              to: "/"
            })
          }}>Logout</Button>
        </div>
        <hr />
        <Outlet />
      </div>
    </>
  }
})



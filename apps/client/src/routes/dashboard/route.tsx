import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAuthed } from "@/utils/dashboard";
import { queryClient } from "@/utils/query";

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const jwt = queryClient.getQueryData(['jwt'])

    if (!(await isAuthed(jwt as string))) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        }
      })
    }
  },
  component: () => <>
    <Outlet />
  </>
})


import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../store/auth";
import { isAuthed } from "../../utils/dashboard";

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ location }) => {
    const { jwt } = useAuthStore.getState()

    if (!(await isAuthed(jwt))) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        }
      })
    }
  },
  component: () => {
    const { user } = useAuthStore()

    return <>
      <h1>{user.username}</h1>
      <Outlet />
    </>
  }
})


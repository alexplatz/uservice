import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../store/auth";
import { useUserStore } from "../../store/user";
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
    const { username } = useUserStore.getState()

    return <>
      <h1>{username}</h1>
      <Outlet />
    </>
  }
})


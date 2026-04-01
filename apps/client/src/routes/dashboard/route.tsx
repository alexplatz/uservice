import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth";
// import { useUserStore } from "../../store/user";
import { isAuthed } from "@/utils/dashboard";
// import { useCounterStore } from "@/store/count";
// import { Button } from "@/components/ui/button";
// import { getEmails } from "@/api/client";

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
    // const { username } = useUserStore()
    // const { counter, increment } = useCounterStore()

    return <>
      <Outlet />
      {
        // <Button onClick={() => increment(counter)}>{counter}</Button>
        // <Button onClick={() => getEmails('019d0c4d-e910-7000-b45d-0e29f6d2c71a')}>Get Emails</Button>
      }
    </>
  }
})


import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { ClockFadingIcon, House, KeyRound, Mail } from "lucide-react";
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
    <NavSidebar />
    <Outlet />
  </>
})

const NavSidebar = () =>
  <nav className="min-h-screen border-r-1">
    <div className="w-[45px] flex flex-col items-center gap-y-2 mt-2">
      <Link
        to={'/dashboard/account'}
        preload={'intent'}>
        <House />
      </Link>
      <Link
        to={'/dashboard/account/emails'}
        preload={'intent'}>
        <Mail />
      </Link>
      <Link
        to={'/dashboard/account/passkeys'}
        preload={'intent'}>
        <KeyRound />
      </Link>
      <Link
        to={'/dashboard/account/sessions'}
        preload={'intent'}>
        <ClockFadingIcon />
      </Link>
    </div>
  </nav>

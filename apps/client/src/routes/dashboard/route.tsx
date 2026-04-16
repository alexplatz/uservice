import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Sidebar, SidebarContent, SidebarGroup, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
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
    <SidebarProvider defaultOpen={false}>
      <NavSidebar />
      <Outlet />
    </SidebarProvider>
  </>
})

const NavSidebar = () =>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
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
      </SidebarGroup>
      <SidebarRail className="w-1-rem hover:bg-sidebar-accent transition-colors" />
    </SidebarContent>
  </Sidebar>

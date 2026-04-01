import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useUserStore } from "@/store/user";
import { Sidebar, SidebarContent, SidebarGroup, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import { ClockFadingIcon, KeyRound, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/api/client";
import { useAuthStore } from "@/store/auth";

export const Route = createFileRoute('/dashboard/account')({
  beforeLoad: async () => { },
  component: () => {
    const navigate = Route.useNavigate()
    const { username } = useUserStore()
    const { setJwt } = useAuthStore()

    return <>
      <SidebarProvider defaultOpen={false} offsetTop={40}>
        <AccountSidebar />
        <div>
          <h1>{username} account settings</h1>
          <Outlet />
          <Button onClick={async () => {
            await logout()
            setJwt('')
            navigate({
              to: "/"
            })
          }}>Logout</Button>
        </div>
      </SidebarProvider>
    </>
  }
})


const AccountSidebar = () =>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
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

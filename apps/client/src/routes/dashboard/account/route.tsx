import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useUserStore } from "../../../store/user";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { KeyRound, Mail } from "lucide-react";

export const Route = createFileRoute('/dashboard/account')({
  beforeLoad: async () => { },
  component: () => {
    const { username } = useUserStore()

    return <>
      <SidebarProvider defaultOpen={false} offsetTop={40}>
        <AccountSidebar />
        <div>
          <h1>{username} account settings</h1>
          <Outlet />
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
      </SidebarGroup>
      <SidebarRail className="w-1-rem hover:bg-sidebar-accent transition-colors" />
    </SidebarContent>
  </Sidebar>

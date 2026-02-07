import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../../services/apiAuth";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./-components/layout/sidebar/sidebar";

import Navbar from "./-components/layout/navbar/navbar";

export const Route = createFileRoute("/products")({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser();

    if (!user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.pathname,
        },
      });
    }
    return { user };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col">
          <Navbar />
          <div className="flex-1 overflow-auto p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import Menu from "./menu";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-neutral-100/10 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between gap-2 px-4">
        <SidebarTrigger className="-ml-1 hidden lg:flex" />

        <Link to={"/products"} className="flex items-center gap-2 lg:hidden">
          <img src="/logo.png" alt="oeaLogo" />
          <h1 className="text-2xl">oea</h1>
        </Link>

        <div className="flex items-center gap-8">
          <Link to={"/products/create"}>
            <Button variant={"oea"}>
              <Plus className="size-4" />
              新增商品
            </Button>
          </Link>
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

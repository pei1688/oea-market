import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LoaderCircle, LogOut } from "lucide-react";
import type { MenuProps } from "./menu";

const WebMenu = ({ data, logout, isPending }: MenuProps) => {
  if (!data?.user) {
    return null; 
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer rounded-full bg-neutral-100 p-1 transition-all hover:bg-neutral-200">
        <svg
          width="32px"
          height="32px"
          strokeWidth="1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="currentColor"
          className="text-primary"
        >
          <path
            d="M5 20V19C5 15.134 8.13401 12 12 12V12C15.866 12 19 15.134 19 19V20"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{data?.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          {" "}
          {isPending ? (
            <LoaderCircle className="size-4" />
          ) : (
            <div className="flex items-center gap-2">
              <LogOut className="size-4" />
              <span>登出</span>
            </div>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WebMenu;

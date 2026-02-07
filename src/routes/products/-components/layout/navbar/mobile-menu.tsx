import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { MenuProps } from "./menu";
import { Link } from "@tanstack/react-router";
import Spinner from "@/components/ui/spinner";

const MobileMenu = ({ data, logout, isPending }: MenuProps) => {
  if (!data?.user) {
    return null;
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <svg
          width="24px"
          height="24px"
          strokeWidth="1"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          color="currentColor"
          className="text-primary"
        >
          <path
            d="M3 5H21"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M3 12H21"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
          <path
            d="M3 19H21"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>選單</SheetTitle>
        </SheetHeader>
        <ul className="space-y-8 pl-8 font-medium">
          <li>
            {" "}
            <Link to={"/products/dashboard"}>首頁</Link>
          </li>
          <li>
            <Link to={"/products"}>商品列表</Link>
          </li>
        </ul>
        <SheetFooter className="space-y-6">
          <span>{data?.user.email}</span>
          <SheetClose asChild>
            <Button variant="outline" onClick={logout}>
              {isPending ? (
                <Spinner />
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    width="24px"
                    height="24px"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="CurrentColor"
                    className="text-primary"
                  >
                    <path
                      d="M12 12H19M19 12L16 15M19 12L16 9"
                      stroke="CurrentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M19 6V5C19 3.89543 18.1046 3 17 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V18"
                      stroke="CurrentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span>登出</span>
                </div>
              )}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

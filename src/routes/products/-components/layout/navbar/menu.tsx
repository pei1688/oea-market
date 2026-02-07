import { useUser } from "@/hooks/useUser";
import MobileMenu from "./mobile-menu";
import WebMenu from "./web-menu";
import { useLogout } from "@/hooks/useLogin";
import type { User } from "@supabase/supabase-js";

export interface MenuProps {
  data:
    | {
        user: User;
      }
    | null
    | undefined;
  logout: () => void;
  isPending: boolean;
}

const Menu = () => {
  const { data } = useUser();
  const { logout, isPending } = useLogout();
  return (
    <>
      {" "}
      <div className="hidden lg:flex">
        <WebMenu data={data} logout={logout} isPending={isPending} />
      </div>
      <div className="flex lg:hidden">
        <MobileMenu data={data} logout={logout} isPending={isPending} />
      </div>
    </>
  );
};

export default Menu;

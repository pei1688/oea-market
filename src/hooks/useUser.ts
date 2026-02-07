import { useQuery } from "@tanstack/react-query";

import supabase from "../lib/supabase";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        await supabase.auth.signOut();
        return null;
      }

      return data;
    },
  });
}

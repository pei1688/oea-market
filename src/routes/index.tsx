import { createFileRoute, redirect } from "@tanstack/react-router";
import { getCurrentUser } from "../services/apiAuth";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const user = await getCurrentUser();

    if (!user) {
      throw redirect({ to: "/login" });
    }

    throw redirect({ to: "/products" });
  },
});

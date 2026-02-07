import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center">
      <img src="/user.jpg" alt="guagua" />
    </div>
  );
}

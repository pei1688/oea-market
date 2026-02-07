import { createFileRoute } from "@tanstack/react-router";
import { DataTable } from "./-components/data-table/data-table";
import z from "zod";

export const Route = createFileRoute("/products/")({
  validateSearch: z.object({
    page: z.number().catch(0).optional(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1 className="text-2xl font-medium">商品列表</h1>
      <DataTable />
    </div>
  );
}

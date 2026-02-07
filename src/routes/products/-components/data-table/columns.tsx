import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Actions from "./actions";
import { recentlyUpdated } from "@/lib/utils";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "inventoryNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        編號
        <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="pl-4" title={getValue<string>()}>
        {getValue<string>()}
      </div>
    ),
  },

  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        商品名稱
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.original.updated_at;
      const isNew = recentlyUpdated(updatedAt);

      return (
        <div className="flex items-center gap-2 pl-4">
          <span>{row.getValue("productName")}</span>
          {isNew && (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "productImages",
    header: "商品圖片",
    cell: ({ row }) => {
      const images: [""] = row.getValue("productImages");
      return (
        <div>
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={row.getValue("productImages")}
              className="h-12 w-12 rounded object-cover"
            />
          ) : (
            <div className="bg-base-200 flex h-12 w-12 items-center justify-center rounded text-xs">
              無圖片
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "productTags",
    header: "商品標籤",
    cell: ({ row }) => (
      <Badge className="text-sm" variant="secondary">
        {row.getValue("productTags")}
      </Badge>
    ),
  },

  {
    accessorKey: "inventoryQuantity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          庫存數量
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue("inventoryQuantity") as number;
      return (
        <div className={quantity < 10 ? "pl-4 font-medium" : "pl-4"}>
          {quantity}
        </div>
      );
    },
  },
  {
    accessorKey: "productPrice",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            售價
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("productPrice"));
      const formatted = new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
      }).format(price);

      return <div className="pl-4 font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "costPrice",
    header: () => <div>成本價</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("costPrice"));
      const formatted = new Intl.NumberFormat("zh-TW", {
        style: "currency",
        currency: "TWD",
      }).format(cost);

      return <div className="text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            建立時間
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      const diffMs = Date.now() - new Date(createdAt).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      return (
        <div className="pl-4 text-sm">
          {diffHours < 24
            ? `${diffHours} 小時前`
            : new Date(createdAt).toLocaleDateString("zh-TW")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      return <Actions product={product} />;
    },
  },
];

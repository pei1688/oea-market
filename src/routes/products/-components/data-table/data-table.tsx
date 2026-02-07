// 修正後的 DataTable 組件

"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/services/apiProducts";
import type { Product } from "@/types/products";
import MobileData from "./mobile-data";
import Spinner from "@/components/ui/spinner";
import { useNavigate, useSearch } from "@tanstack/react-router";
type ProductsSearch = {
  page?: number;
};
export function DataTable() {
  const navigate = useNavigate({ from: "/products/" });
  const search = useSearch({ from: "/products" });
  const pageIndexFromUrl = Number(search.page ?? 0);

  const { isLoading, data, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 使用 pageIndexFromUrl 作為初始值和同步來源
  const [pagination, setPagination] = React.useState({
    pageIndex: pageIndexFromUrl,
    pageSize: 10,
  });

  // 當 URL 中的 page 參數改變時，同步更新 pagination state
  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: pageIndexFromUrl,
    }));
  }, [pageIndexFromUrl]);

  const sortedData = React.useMemo(() => {
    if (!data) return [];

    // 如果沒有自訂排序，按 created_at 降序排列
    if (sorting.length === 0) {
      return [...data].sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    }

    return data;
  }, [data, sorting]);

  const table = useReactTable({
    data: sortedData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  // 當 pagination 改變時，更新 URL 和 sessionStorage
  React.useEffect(() => {
    // 更新 URL
    navigate({
      search: (prev: ProductsSearch) => ({
        ...prev,
        page: pagination.pageIndex,
      }),
      replace: true,
    });

    // 同時保存到 sessionStorage 作為備份
    sessionStorage.setItem("productsPage", String(pagination.pageIndex));
  }, [pagination.pageIndex, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-240 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-240 items-center justify-center text-red-600">
        載入失敗
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden flex-col gap-6 py-4 lg:flex lg:flex-row lg:items-center lg:gap-2">
        <Input
          placeholder="搜尋商品名稱..."
          value={
            (table.getColumn("productName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("productName")?.setFilterValue(event.target.value)
          }
          className="lg:max-w-sm"
        />
        <Input
          placeholder="搜尋款式..."
          value={
            (table.getColumn("productTags")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("productTags")?.setFilterValue(event.target.value)
          }
          className="lg:max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              選擇欄位 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const columnLabels: Record<string, string> = {
                  order: "編號",
                  productName: "商品名稱",
                  productImages: "商品圖片",
                  productTags: "標籤",
                  inventoryNumber: "庫存編號",
                  inventoryQuantity: "庫存數量",
                  productPrice: "售價",
                  costPrice: "成本價",
                  created_at: "建立時間",
                };

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnLabels[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden overflow-hidden rounded-md border lg:block">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  沒有符合條件的結果。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="hidden items-center justify-between py-4 lg:flex">
        <div className="text-muted-foreground text-sm">
          第 {pagination.pageIndex + 1} 頁，共 {table.getPageCount()} 頁
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一頁
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一頁
          </Button>
        </div>
      </div>

      {/*mobile*/}
      <MobileData products={data ?? []} />
    </div>
  );
}

// useProductForm 保持不變，已經正確實現
// 這個文件不需要修改，因為它已經正確地導航到帶有 page 參數的 URL

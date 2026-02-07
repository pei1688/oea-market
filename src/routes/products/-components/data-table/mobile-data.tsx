import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Product } from "@/types/products";
import { Link } from "@tanstack/react-router";
import DeleteAction from "./delete-action";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { recentlyUpdated } from "@/lib/utils";

interface MobileDataProps {
  products: Product[];
}
type SortKey =
  | "updated-desc"
  | "updated-asc"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "inventory-asc"
  | "inventory-desc";

const MobileData = ({ products }: MobileDataProps) => {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedProductName, setSelectedProductName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("updated-desc"); // 預設為最新更新時間
  const [filterTag, setFilterTag] = useState<string>("all");

  // 取得所有唯一的標籤
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((product) => {
      if (product.productTags) {
        tags.add(product.productTags);
      }
    });
    return Array.from(tags);
  }, [products]);

  // 篩選和排序商品
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // 搜尋
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 標籤
    if (filterTag !== "all") {
      filtered = filtered.filter(
        (product) => product.productTags === filterTag,
      );
    }

    const sortMap: Record<SortKey, (a: Product, b: Product) => number> = {
      "updated-desc": (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      "updated-asc": (a, b) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      "name-asc": (a, b) => a.productName.localeCompare(b.productName, "zh-TW"),
      "name-desc": (a, b) =>
        b.productName.localeCompare(a.productName, "zh-TW"),
      "price-asc": (a, b) => (a.productPrice ?? 0) - (b.productPrice ?? 0),
      "price-desc": (a, b) => (b.productPrice ?? 0) - (a.productPrice ?? 0),
      "inventory-asc": (a, b) =>
        (a.inventoryQuantity ?? 0) - (b.inventoryQuantity ?? 0),
      "inventory-desc": (a, b) =>
        (b.inventoryQuantity ?? 0) - (a.inventoryQuantity ?? 0),
    };

    return [...filtered].sort(sortMap[sortBy as SortKey]);
  }, [products, searchTerm, sortBy, filterTag]);

  const handleDelete = (productId: string, productName: string) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setOpen(true);
  };

  return (
    <div className="mt-6 space-y-4 lg:hidden">
      {/* 搜尋列 */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="搜尋商品名稱..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Drawer>
          <DrawerTrigger className="flex h-9 w-full items-center justify-center rounded-md border shadow-sm">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            顯示過濾
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>過濾選項</DrawerTitle>
              <div className="space-y-6 rounded-lg border p-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">排序方式</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="updated-desc">
                        更新時間 (新到舊)
                      </SelectItem>
                      <SelectItem value="updated-asc">
                        更新時間 (舊到新)
                      </SelectItem>
                      <SelectItem value="name-asc">名稱 (A-Z)</SelectItem>
                      <SelectItem value="name-desc">名稱 (Z-A)</SelectItem>
                      <SelectItem value="price-asc">價格 (低到高)</SelectItem>
                      <SelectItem value="price-desc">價格 (高到低)</SelectItem>
                      <SelectItem value="inventory-asc">
                        庫存 (低到高)
                      </SelectItem>
                      <SelectItem value="inventory-desc">
                        庫存 (高到低)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">商品標籤</Label>
                  <Select value={filterTag} onValueChange={setFilterTag}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部標籤</SelectItem>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 重置按鈕 */}
                {(searchTerm ||
                  sortBy !== "updated-desc" ||
                  filterTag !== "all") && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSearchTerm("");
                      setSortBy("updated-desc");
                      setFilterTag("all");
                    }}
                    className="mt-6 w-full"
                  >
                    重置所有篩選
                  </Button>
                )}
              </div>
            </DrawerHeader>

            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  關閉
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>

        {/* 結果統計 */}
        <p className="text-muted-foreground text-sm">
          顯示 {filteredAndSortedProducts.length} / {products.length} 項商品
        </p>
      </div>

      {/* 商品列表 */}
      {filteredAndSortedProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">找不到符合條件的商品</p>
          </CardContent>
        </Card>
      ) : (
        filteredAndSortedProducts.map((product) => {
          const isUpdated = recentlyUpdated(product.updated_at);

          return (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex gap-4">
                  {product.productImages && product.productImages.length > 0 ? (
                    <img
                      src={product.productImages[0]}
                      alt={product.productName}
                      className="h-20 w-20 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-lg border text-xs">
                      無圖片
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2">
                      {product.productName}
                      {isUpdated && (
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                        </span>
                      )}
                    </span>
                    <span className="text-lg font-bold">
                      ${product.productPrice}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="flex flex-wrap items-center gap-4">
                  <p className="text-sm">庫存：{product.inventoryQuantity}</p>
                  {product.productTags && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">標籤：</span>
                      <Badge variant="secondary">{product.productTags}</Badge>
                    </div>
                  )}
                  <p className="text-sm">成本價：${product.costPrice}</p>
                </div>
                <Separator className="my-4" />
                <div className="flex gap-4">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/products/${product.id}`}>編輯</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() =>
                      handleDelete(product.id, product.productName)
                    }
                  >
                    刪除
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      <DeleteAction
        open={open}
        setOpen={setOpen}
        productId={selectedProductId}
        prodcutName={selectedProductName}
      />
    </div>
  );
};

export default MobileData;

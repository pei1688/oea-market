import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import type { ProductVariant } from "@/types/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FormInventory = () => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  // 監聽 variants 的變化
  const variants = useWatch({ name: "variants", exact: false });

  // 當 variants 改變時，自動計算總庫存
  useEffect(() => {
    if (variants && variants.length > 0) {
      const totalStock = variants.reduce(
        (sum: number, variant: ProductVariant) =>
          sum + (Number(variant.stock) || 0),
        0,
      );
      setValue("inventoryQuantity", totalStock);
    }
  }, [variants, setValue]);

  // 判斷是否有變體
  const hasVariants = variants && variants.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>商品庫存</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div>
            <Label className="mb-2 text-neutral-600">庫存數量</Label>
            <Input
              {...register("inventoryQuantity", { valueAsNumber: true })}
              type="number"
              className={`w-full ${hasVariants ? "input-disabled" : ""}`}
              placeholder={hasVariants ? "自動計算中..." : "請輸入數量"}
              disabled={hasVariants}
              readOnly={hasVariants}
            />
            {errors.inventoryQuantity && (
              <p className="mt-2 text-sm text-red-600">
                {errors.inventoryQuantity.message as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormInventory;

import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const FastCreateForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>建立商品</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="lg:border-base-content/50 flex flex-col space-y-6 rounded-xl lg:border lg:p-6">
          <div>
            <Label className="mb-2 text-neutral-600">商品名稱</Label>
            <Input
              type="text"
              {...register("productName")}
              className="w-full"
              placeholder=" 商品名稱"
            />
            {errors.productName && (
              <p className="mt-2 text-sm text-red-600">
                {errors.productName.message as string}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 text-neutral-600">標籤名稱</Label>
            <Input
              {...register("productTags")}
              type="text"
              className="w-full"
              placeholder="ex.扭蛋、玩具"
            />
            {errors.productTags && (
              <p className="mt-2 text-sm text-red-600">
                {errors.productTags.message as string}
              </p>
            )}
          </div>
          <div>
            <Label className="mb-2 text-neutral-600">庫存數量</Label>
            <Input
              {...register("inventoryQuantity", { valueAsNumber: true })}
              type="number"
              className={`w-full`}
              placeholder={"請輸入數量"}
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

export default FastCreateForm;

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const FormPrice = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  // 🔍 即時監聽表單欄位
  const exchangeRate = watch("exchangeRate") || 0;
  const costPrice = watch("costPrice") || 0;

  // 🧮 自動計算台幣價格
  const twdPrice = (costPrice * exchangeRate).toFixed(2);
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>商品價格</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div>
            <Label className="mb-2 text-neutral-600">匯率</Label>
            <Input
              {...register("exchangeRate", { valueAsNumber: true })}
              type="number"
              className="w-full"
              placeholder="請輸入匯率"
              step={"0.1"}
            />
            {errors.exchangeRate && (
              <p className="mt-2 text-sm text-red-600">
                {errors.exchangeRate.message as string}
              </p>
            )}
          </div>
          <div className="gap-6">
            {/* 第一欄 */}
            <Label className="mb-2 text-neutral-600">成本價格</Label>
            <div className="flex flex-col gap-2">
              <Input
                {...register("costPrice", { valueAsNumber: true })}
                type="number"
                className="w-full"
                placeholder="請輸入價格"
              />
              {/* 第二欄 */}
              <div className="text-oea text-sm font-medium">
                自動計算：{costPrice} × {exchangeRate} = {twdPrice}
              </div>
            </div>
            {errors.costPrice && (
              <p className="mt-2 text-sm text-red-600">
                {errors.costPrice.message as string}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-2 text-neutral-600">商品價格</Label>
            <Input
              {...register("productPrice", { valueAsNumber: true })}
              type="number"
              className="w-full"
              placeholder="請輸入價格"
            />
            <span className="mt-2 text-xs font-medium text-neutral-400">
              單位(臺幣)
            </span>
            {errors.productPrice && (
              <p className="mt-2 text-sm text-red-600">
                {errors.productPrice.message as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormPrice;

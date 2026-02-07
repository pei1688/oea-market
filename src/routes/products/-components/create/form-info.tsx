import { useFormContext } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const FormInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>商品資訊</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
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
            <Label className="mb-2 text-neutral-600">商品描述</Label>
            <Textarea
              {...register("productDescription")}
              className="min-h-24 w-full"
              placeholder="請輸入描述"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormInfo;

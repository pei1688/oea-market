import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const FormTags = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>商品標籤</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div>
            <Label className="mb-2 text-neutral-600">標籤名稱</Label>
            <Input
              {...register("productTags")}
              type="text"
              className="w-full"
              placeholder="ex.扭蛋、玩具"
            />
            {errors.productTags && (
              <p className="mt-2 text-red-600 text-sm">
                {errors.productTags.message as string}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormTags;

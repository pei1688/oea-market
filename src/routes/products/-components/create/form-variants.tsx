import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const FormVariants = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAddVariant = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    append({
      name: "",
      stock: 0,
      price: 0,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>商品規格</CardTitle>
        <CardDescription>點擊新增規格按鈕新增欄位</CardDescription>
        <CardAction>
          <Button onClick={handleAddVariant} className="shadow-2xl">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            新增規格
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="mt-2 flex flex-col space-y-4">
          {fields.length === 0 ? (
            <div className="flex h-36 items-center justify-center rounded-lg border border-dashed text-sm text-neutral-400">
              請新增欄位
            </div>
          ) : (
            <>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">規格 {index + 1}</h4>
                    <Button
                      variant={"secondary"}
                      onClick={() => remove(index)}
                      className="btn btn-ghost btn-sm btn-circle"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18 6L6 18M6 6L18 18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Button>
                  </div>

                  <VariantFields index={index} />
                </div>
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// 分離出來的變體輸入欄位組件
const VariantFields = ({ index }: { index: number }) => {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col  gap-2 lg:flex-row ">
      <div className="flex-1">
        <Label className="mb-2 text-neutral-600">規格名稱</Label>
        <Input
          {...register(`variants.${index}.name`)}
          type="text"
          placeholder="ex.綠色"
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <Label className="mb-2 text-neutral-600">庫存數量</Label>
        <Input
          {...register(`variants.${index}.stock`, { valueAsNumber: true })}
          type="number"
          placeholder="請輸入數量"
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <Label className="mb-2 text-neutral-600">價格</Label>
        <Input
          {...register(`variants.${index}.price`, { valueAsNumber: true })}
          type="number"
          placeholder="請輸入價格"
          min="0"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default FormVariants;

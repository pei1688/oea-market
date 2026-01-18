import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import type { ProductVariant } from "../../../../types/products";

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
    <fieldset className="fieldset w-full space-y-4">
      <legend className="fieldset-legend px-2 text-2xl">庫存</legend>
      <div className="border-base-content/10 flex flex-col space-y-6 rounded-xl border px-6 py-10">
        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            庫存編號
          </label>
          <input
            {...register("inventoryNumber")}
            type="text"
            className="input input-bordered w-full"
            placeholder="請輸入編號"
          />
          {errors.inventoryNumber && (
            <p className="mt-2 text-sm text-red-600">
              {errors.inventoryNumber.message as string}
            </p>
          )}
        </div>

        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            庫存數量
          </label>
          <input
            {...register("inventoryQuantity", { valueAsNumber: true })}
            type="number"
            className={`input input-bordered w-full ${hasVariants ? "input-disabled" : ""}`}
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
    </fieldset>
  );
};

export default FormInventory;

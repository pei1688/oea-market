import { useFormContext } from "react-hook-form";

const FormPrice = () => {
  const { register, watch } = useFormContext();

  // 🔍 即時監聽表單欄位
  const exchangeRate = watch("exchangeRate") || 0;
  const costPrice = watch("costPrice") || 0;

  // 🧮 自動計算台幣價格
  const twdPrice = (costPrice * exchangeRate).toFixed(2);
  return (
    <fieldset className="fieldset w-full space-y-4">
      <legend className="fieldset-legend px-2 text-2xl">商品價格</legend>
      <div className="border-base-content/50 flex flex-col space-y-6 rounded-xl border p-6">
        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            匯率
          </label>
          <input
            {...register("exchangeRate", { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="input input-bordered h-12 w-full font-mono"
            placeholder="請輸入匯率"
          />
        </div>
        <div className="fieldset-field gap-6">
          {/* 第一欄 */}
          <label className="fieldset-label text-base-content mb-2 text-lg font-medium">
            成本價格
          </label>
          <div className="flex flex-col gap-2">
            <input
              {...register("costPrice", { valueAsNumber: true })}
              type="number"
              className="input input-bordered h-12 w-full font-mono"
              placeholder="請輸入價格"
            />
            {/* 第二欄 */}
            <div className="text-accent text-sm font-medium">
              自動計算：{costPrice} × {exchangeRate} = {twdPrice}
            </div>
          </div>
        </div>

        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            商品價格
          </label>
          <input
            {...register("productPrice", { valueAsNumber: true })}
            type="number"
            className="input input-bordered h-12 w-full font-mono"
            placeholder="請輸入價格"
          />
          <p className="text-accent mt-2">單位(臺幣)</p>
        </div>
      </div>
    </fieldset>
  );
};

export default FormPrice;

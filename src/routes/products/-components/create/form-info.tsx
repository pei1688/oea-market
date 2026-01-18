import { useFormContext } from "react-hook-form";

const FormInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <fieldset className="fieldset w-full space-y-4">
      <legend className="fieldset-legend px-2 text-2xl">商品資訊</legend>
      <div className="border-base-content/10 flex flex-col space-y-6 rounded-xl border px-6 py-10">
        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            商品名稱
          </label>
          <input
            type="text"
            {...register("productName")}
            className="input w-full"
            placeholder="請輸入名稱"
          />
          {errors.productName && (
            <p className="label text-red-500">
              {errors.productName.message as string}
            </p>
          )}
        </div>

        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            商品描述
          </label>
          <textarea
            {...register("productDescription")}
            className="textarea textarea-bordered w-full"
            placeholder="請輸入描述"
            rows={4}
          />
          {errors.productDescription && (
            <p className="mt-1 text-sm text-red-500">
              {errors.productDescription.message as string}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default FormInfo;

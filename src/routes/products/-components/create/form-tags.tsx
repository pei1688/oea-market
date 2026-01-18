import { useFormContext } from "react-hook-form";

const FormTags = () => {
  const { register } = useFormContext();
  return (
    <fieldset className="fieldset w-full space-y-4">
      <legend className="fieldset-legend px-2 text-2xl">商品標籤</legend>
      <div className="border-base-content/50 flex flex-col space-y-6 rounded-xl border p-6">
        <div className="fieldset-field">
          <label className="fieldset-label text-base-content mb-3 text-lg font-medium">
            標籤名稱
          </label>
          <input
            {...register("productTags")}
            type="text"
            className="input input-bordered w-full"
            placeholder="ex.扭蛋、玩具"
          />
        </div>
      </div>
    </fieldset>
  );
};

export default FormTags;

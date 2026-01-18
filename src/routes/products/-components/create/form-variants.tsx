import { useFieldArray, useFormContext } from "react-hook-form";

const FormVariants = () => {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleAddVariant = () => {
    append({
      name: "",
      stock: 0,
      price: 0,
    });
  };

  return (
    <fieldset className="fieldset w-full space-y-4">
      <legend className="fieldset-legend px-2 text-2xl">商品規格</legend>
      <div className="border-base-content/50 flex flex-col space-y-4 rounded-xl border p-6">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <button
              type="button"
              onClick={handleAddVariant}
              className="btn btn-outline btn-accent"
            >
              <svg
                width="20"
                height="20"
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
            </button>
          </div>
        ) : (
          <>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border-base-content/20 flex flex-col gap-4 rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">規格 {index + 1}</h4>
                  <button
                    type="button"
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
                  </button>
                </div>

                <VariantFields index={index} />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddVariant}
              className="btn btn-outline btn-sm"
            >
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
              新增更多規格
            </button>
          </>
        )}
      </div>
    </fieldset>
  );
};

// 分離出來的變體輸入欄位組件
const VariantFields = ({ index }: { index: number }) => {
  const { register } = useFormContext();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="fieldset-field">
        <label className="fieldset-label text-base-content mb-2 text-sm font-medium">
          規格名稱
        </label>
        <input
          {...register(`variants.${index}.name`)}
          type="text"
          className="input input-bordered input-sm w-full"
          placeholder="ex.綠色"
        />
      </div>

      <div className="fieldset-field">
        <label className="fieldset-label text-base-content mb-2 text-sm font-medium">
          庫存
        </label>
        <input
          {...register(`variants.${index}.stock`, { valueAsNumber: true })}
          type="number"
          className="input input-bordered input-sm w-full"
          placeholder="請輸入數量"
          min="0"
        />
      </div>

      <div className="fieldset-field">
        <label className="fieldset-label text-base-content mb-2 text-sm font-medium">
          價格
        </label>
        <input
          {...register(`variants.${index}.price`, { valueAsNumber: true })}
          type="number"
          className="input input-bordered input-sm w-full"
          placeholder="請輸入價格"
          min="0"
        />
      </div>
    </div>
  );
};

export default FormVariants;

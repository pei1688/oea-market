import { useRef, useMemo, useEffect } from "react";
import { useWatch } from "react-hook-form";

interface FormImageProps {
  onImageUpload: (files: FileList) => void;
  onImageRemove: (index: number) => void;
  isUploading: boolean;
}

const FormImage = ({
  onImageUpload,
  onImageRemove,
  isUploading,
}: FormImageProps) => {
  const rawImages = useWatch({ name: "productImages" });
  // 現在可能是 blob URL 或 supabase URL 的混合
  const images: string[] = useMemo(() => rawImages ?? [], [rawImages]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_IMAGES = 5;

  // 清理 blob URLs
  useEffect(() => {
    return () => {
      images.forEach((url) => {
        if (url?.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      alert(`最多只能上傳 ${MAX_IMAGES} 張圖片`);
      e.target.value = "";
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      alert(
        `只能再選擇 ${remainingSlots} 張圖片,已自動截取前 ${remainingSlots} 張`,
      );
    }

    const dataTransfer = new DataTransfer();
    filesToUpload.forEach((file) => dataTransfer.items.add(file));

    onImageUpload(dataTransfer.files);
    e.target.value = "";
  };

  const handleAddPhoto = () => {
    if (images.length >= MAX_IMAGES) {
      alert(`最多只能上傳 ${MAX_IMAGES} 張圖片`);
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <fieldset className="fieldset w-full space-y-4">
      <legend className="fieldset-legend px-2 text-2xl">商品圖片</legend>
      <div className="border-base-content/50 flex flex-col space-y-6 rounded-xl border p-6">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((imageUrl: string, index: number) => (
            <div
              key={index}
              className="group border-base-content/20 bg-base-200 relative aspect-square overflow-hidden rounded-lg border"
            >
              <img
                src={imageUrl}
                alt={`預覽 ${index + 1}`}
                className="h-full w-full object-cover"
              />

              {/* 標示待上傳的圖片 */}
              {imageUrl?.startsWith("blob:") && (
                <div className="bg-warning/80 text-warning-content absolute top-2 left-2 rounded px-2 py-1 text-xs font-medium">
                  待上傳
                </div>
              )}

              <button
                onClick={() => onImageRemove(index)}
                className="btn btn-circle btn-error btn-sm absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
                type="button"
                disabled={isUploading}
              >
                <svg
                  width="24px"
                  height="24px"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                >
                  <path
                    d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <button
              onClick={handleAddPhoto}
              type="button"
              disabled={isUploading}
              className="border-base-content/20 hover:border-primary hover:bg-base-200 flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? (
                <div className="loading loading-spinner loading-md text-accent"></div>
              ) : (
                <>
                  <svg
                    width="24px"
                    height="24px"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    color="currentColor"
                    className="text-accent"
                  >
                    <path
                      d="M6 12H12M18 12H12M12 12V6M12 12V18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span className="text-base-content/60 text-sm">加入照片</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="label">
          <span className="label-text-alt">
            最多上傳 {MAX_IMAGES} 張,每張最大 2MB
          </span>
          <span className="label-text-alt">
            已選擇 {images.length} / {MAX_IMAGES}
          </span>
        </div>
      </div>
    </fieldset>
  );
};

export default FormImage;

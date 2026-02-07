import { useRef, useMemo, useEffect } from "react";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>商品圖片</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="lg:border-base-content/50 flex flex-col space-y-6 rounded-xl lg:border lg:p-6">
          <Input
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
                className="group border-primary hover:border-primary/50 relative aspect-square overflow-hidden rounded-lg border transition-all"
              >
                <img
                  src={imageUrl}
                  alt={`預覽 ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <Button
                  onClick={() => onImageRemove(index)}
                  className="absolute top-2 right-2 rounded-full lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100"
                  type="button"
                  disabled={isUploading}
                  variant={"destructive"}
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
                </Button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <button
                onClick={handleAddPhoto}
                type="button"
                disabled={isUploading}
                className="hover:border-oea/90 border-oea flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="text-primary text-sm">上傳圖片中...</div>
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
                      className="text-primary"
                    >
                      <path
                        d="M6 12H12M18 12H12M12 12V6M12 12V18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span className="text-primary lg:text-xs xl:text-lg">加入照片</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-primary text-xs">
          每張最大 2MB,已選擇 {images.length} / {MAX_IMAGES}
        </span>
      </CardFooter>
    </Card>
  );
};

export default FormImage;

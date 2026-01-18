import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  createProducts,
  updateProduct,
  uploadProductImage,
} from "../services/apiProducts";
import type { Product, ProductFormData } from "../types/products";

interface UseProductFormOptions {
  mode?: "create" | "edit";
  productId?: string;
  initialData?: ProductFormData;
}

export function useProductForm(options: UseProductFormOptions = {}) {
  const { mode = "create", productId, initialData } = options;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<Product>({
    defaultValues: initialData || {
      productName: "",
      productDescription: "",
      productTags: "",
      productImages: [],
      inventoryNumber: 0,
      inventoryQuantity: 0,
      exchangeRate: 0,
      costPrice: 0,
      productPrice: 0,
      variants: [],
    },
  });
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // 重置表單
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
      setPendingFiles([]);
    }
  }, [initialData, form]);

  const createMutation = useMutation({
    mutationFn: createProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setPendingFiles([]);
      navigate({ to: "/products" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setPendingFiles([]);
      navigate({ to: "/products" });
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsUploading(true);

    try {
      // 1. 上傳所有待上傳的圖片
      const uploadedUrls: string[] = [];

      if (pendingFiles.length > 0) {
        const uploadPromises = pendingFiles.map((file) =>
          uploadProductImage(file),
        );
        const newUrls = await Promise.all(uploadPromises);
        uploadedUrls.push(...newUrls);
      }

      // 2. 合併已有的 URL 和新上傳的 URL
      const currentImages = form.getValues("productImages") || [];
      const existingUrls = currentImages.filter(
        (img) => typeof img === "string" && img.includes("supabase.co"),
      );

      const allImageUrls = [...existingUrls, ...uploadedUrls];

      // 3. 準備提交的資料
      const submitData = {
        ...data,
        productImages: allImageUrls,
        variants: data.variants || [],
      };
      // 4. 提交表單
      if (mode === "edit" && productId) {
        await updateMutation.mutateAsync({
          id: productId,
          data: submitData,
        });
      } else {
        await createMutation.mutateAsync({
          productData: submitData,
          variants: submitData.variants,
        });
      }
    } catch (error) {
      console.error("提交失敗:", error);
    } finally {
      setIsUploading(false);
    }
  });

  // 處理圖片選擇 - 只建立預覽,不上傳
  const handleImageSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // 更新待上傳的檔案列表
    setPendingFiles((prev) => [...prev, ...newFiles]);

    // 建立預覽 URL (使用 blob URL)
    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    const currentImages = form.getValues("productImages") || [];
    form.setValue("productImages", [...currentImages, ...previewUrls]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("productImages") || [];
    const imageToRemove = currentImages[index];

    // 如果是 blob URL,從待上傳列表中移除對應的 File
    if (imageToRemove?.startsWith("blob:")) {
      // 找到對應的 File index
      const blobUrls = currentImages.filter((img) => img?.startsWith("blob:"));
      const blobIndex = blobUrls.indexOf(imageToRemove);

      if (blobIndex !== -1) {
        setPendingFiles((prev) => prev.filter((_, i) => i !== blobIndex));
      }

      // 釋放 blob URL
      URL.revokeObjectURL(imageToRemove);
    }

    // 從表單中移除
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("productImages", newImages);
  };

  return {
    form,
    handleSubmit,
    handleImageSelect,
    removeImage,
    isUploading,
    isSubmitting:
      mode === "edit" ? updateMutation.isPending : createMutation.isPending,
  };
}

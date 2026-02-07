import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  createProducts,
  deleteProduct,
  updateProduct,
  uploadProductImage,
} from "../services/apiProducts";
import type { ProductFormData } from "../types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/schemas/productSchema";
import { generateInventoryNumber } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
interface UseProductFormOptions {
  mode?: "create" | "edit";
  productId?: string;
  initialData?: ProductFormData;
}

export function useProductForm(options: UseProductFormOptions = {}) {
  const { mode = "create", productId, initialData } = options;

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      productDescription: "",
      productTags: "",
      productImages: [],
      inventoryNumber: "",
      inventoryQuantity: 0,
      exchangeRate: 0,
      costPrice: 0,
      productPrice: 0,
      variants: [],
    },
  });

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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
      toast.success("商品建立成功");
      const savedPage = sessionStorage.getItem("productsPage");
      navigate({
        to: "/products",
        search: savedPage ? { page: Number(savedPage) } : { page: 0 },
      });
    },
    onError: (error) => {
      console.error("商品建立失敗:", error);
      toast.error("商品建立失敗");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      setPendingFiles([]);
      toast.success("商品更新成功");
      const savedPage = sessionStorage.getItem("productsPage");
      navigate({
        to: "/products",
        search: savedPage ? { page: Number(savedPage) } : { page: 0 },
      });
    },
    onError: (error) => {
      console.error("商品更新失敗:", error);
      toast.error("商品更新失敗");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      toast.success("商品刪除成功");
    },
    onError: (error) => {
      console.error("商品刪除失敗:", error);
      toast.error("商品刪除失敗");
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsUploading(true);

    try {
      // 1. 上傳圖片
      const uploadedUrls: string[] = [];

      if (!data.inventoryNumber) {
        data.inventoryNumber = generateInventoryNumber();
        form.setValue("inventoryNumber", data.inventoryNumber);
      }

      if (pendingFiles.length > 0) {
        const uploadPromises = pendingFiles.map((file) =>
          uploadProductImage(file),
        );
        const newUrls = await Promise.all(uploadPromises);
        uploadedUrls.push(...newUrls);
      }

      // 2. 合併圖片 URL
      const currentImages = form.getValues("productImages") || [];
      const existingUrls = currentImages.filter(
        (img) => typeof img === "string" && img.includes("supabase.co"),
      );
      const allImageUrls = [...existingUrls, ...uploadedUrls];

      // 3. 分離 variants 和商品資料
      const { variants, ...productFields } = data;

      // 4. 準備商品資料（不包含 variants）
      const productData = {
        ...productFields,
        productImages: allImageUrls,
      };

      // 5. 提交
      if (mode === "edit" && productId) {
        await updateMutation.mutateAsync({
          id: productId,
          data: {
            ...productData,
            variants: variants || [],
          },
        });
      } else {
        await createMutation.mutateAsync({
          productData,
          variants: variants || [],
        });
      }
    } catch (error) {
      console.error("提交失敗:", error);
    } finally {
      setIsUploading(false);
    }
  });

  const handleImageSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setPendingFiles((prev) => [...prev, ...newFiles]);

    const previewUrls = newFiles.map((file) => URL.createObjectURL(file));
    const currentImages = form.getValues("productImages") || [];
    form.setValue("productImages", [...currentImages, ...previewUrls]);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("productImages") || [];
    const imageToRemove = currentImages[index];

    if (imageToRemove?.startsWith("blob:")) {
      const blobUrls = currentImages.filter((img) => img?.startsWith("blob:"));
      const blobIndex = blobUrls.indexOf(imageToRemove);

      if (blobIndex !== -1) {
        setPendingFiles((prev) => prev.filter((_, i) => i !== blobIndex));
      }

      URL.revokeObjectURL(imageToRemove);
    }

    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("productImages", newImages);
  };

  return {
    form,
    handleSubmit,
    handleImageSelect,
    removeImage,
    deleteMutation,
    isUploading,
    isSubmitting:
      mode === "edit" ? updateMutation.isPending : createMutation.isPending,
  };
}

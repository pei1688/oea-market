import { z } from "zod";

// Variant Schema
export const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "規格名稱為必須"),
  price: z.coerce.number().min(0, "規格價格不能為負數"),
  stock: z.coerce.number().int().min(0, "規格庫存不能為負數"),
});

// Product Schema
export const productSchema = z.object({
  productName: z
    .string()
    .min(1, "商品名稱為必須")
    .max(100, "商品名稱不能超過 100 個字"),

  productDescription: z
    .string()
    .max(1000, "商品描述不能超過 1000 個字")
    .optional(),

  productTags: z.string().min(1, "商品標籤為必須"),

  productImages: z.array(z.string()).max(5, "最多只能上傳 5 張圖片").optional(),

  inventoryNumber: z.string().optional().default("").optional(),

  inventoryQuantity: z
    .union([
      z.coerce.number().int("庫存數量必須是整數").min(0, "庫存數量不能為負數"),
      z.nan(),
    ])
    .optional(),

  exchangeRate: z
    .union([z.coerce.number().min(0, "匯率不能為負數"), z.nan()])
    .optional(),

  costPrice: z
    .union([
      z.coerce.number().int("成本價必須是整數").min(0, "成本價不能為負數"),
      z.nan(),
    ])
    .optional(),

  productPrice: z
    .union([
      z.coerce.number().int("售價必須是整數").min(0, "售價不能為負數"),
      z.nan(),
    ])
    .optional(),
  variants: z.array(productVariantSchema).optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;

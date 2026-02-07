import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FormProvider } from "react-hook-form";

import FormImage from "./-components/create/form-image";
import FormTags from "./-components/create/form-tags";
import FormInventory from "./-components/create/form-inventory";
import FormVariants from "./-components/create/form-variants";
import FormPrice from "./-components/create/form-price";
import FormInfo from "./-components/create/form-info";
import { getProduct } from "../../services/apiProducts";
import { useProductForm } from "../../hooks/useProductForm";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

export const Route = createFileRoute("/products/$productId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { productId } = Route.useParams();

  const {
    isLoading,
    data: product,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct({ productId }),
  });

  const { form, handleSubmit, handleImageSelect, removeImage, isUploading } =
    useProductForm({
      mode: "edit",
      productId,
      initialData: product,
    });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500">載入商品失敗，請稍後再試。</div>
      </div>
    );
  }
  return (
    <FormProvider {...form}>
      <div className="min-h-screen">
        <div className="mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/products"
                className="rounded-2xl p-3 transition-all hover:bg-neutral-100"
              >
                <svg
                  width="36px"
                  height="36px"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  color="currentColor"
                  className="text-primary"
                >
                  <path
                    d="M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </Link>
              <div>
                返回商品列表
                <h1 className="text-3xl font-bold">編輯商品</h1>
              </div>
            </div>
          </div>
          <hr className="text-accent my-10" />
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  <FormImage
                    onImageUpload={handleImageSelect}
                    onImageRemove={removeImage}
                    isUploading={isUploading}
                  />
                  <FormInfo />
                  <FormVariants />
                  <FormInventory />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 lg:col-span-1">
                <FormTags />
                <FormPrice />
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || isUploading}
                  className="mt-6 hidden w-full rounded-lg font-medium disabled:cursor-not-allowed disabled:opacity-50 lg:block"
                >
                  {form.formState.isSubmitting ? "更新中..." : "更新商品"}
                </Button>
              </div>
              {/* mobile*/}
              <div className="bg-muted fixed inset-x-0 bottom-0 z-999 block p-4 lg:hidden">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || isUploading}
                  className="w-full font-medium disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {form.formState.isSubmitting ? "更新中..." : "更新商品"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}

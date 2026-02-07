import { createFileRoute, Link } from "@tanstack/react-router";
import { FormProvider } from "react-hook-form";
import FormImage from "./-components/create/form-image";
import FormTags from "./-components/create/form-tags";
import FormInventory from "./-components/create/form-inventory";
import FormVariants from "./-components/create/form-variants";
import FormPrice from "./-components/create/form-price";
import FormInfo from "./-components/create/form-info";
import { useProductForm } from "../../hooks/useProductForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FastCreateForm from "./-components/create/mobile/fast-create-form";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";

export const Route = createFileRoute("/products/create")({
  component: RouteComponent,
});

function RouteComponent() {
  const [tab, setTab] = useState<"fast" | "normal">("fast");

  // 為快速建立創建單獨的表單實例
  const fastForm = useProductForm();
  // 為一般建立創建單獨的表單實例
  const normalForm = useProductForm();

  // 根據當前 tab 選擇使用哪個表單
  const currentForm = tab === "fast" ? fastForm : normalForm;

  return (
    <div className="bg-base-300 min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="mb-10 flex w-full items-center justify-between">
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
              <h1 className="text-3xl font-bold">新增商品</h1>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <Tabs
          defaultValue="fast"
          className="block w-full lg:hidden"
          value={tab}
          onValueChange={(v) => setTab(v as "fast" | "normal")}
        >
          <TabsList className="mb-6 w-full">
            <TabsTrigger value="fast">快速建立</TabsTrigger>
            <TabsTrigger value="normal">一般建立</TabsTrigger>
          </TabsList>

          <TabsContent value="fast">
            <FormProvider {...fastForm.form}>
              <form onSubmit={fastForm.handleSubmit}>
                <div className="grid grid-cols-1 gap-6">
                  <FastCreateForm />
                </div>
              </form>
            </FormProvider>
          </TabsContent>

          <TabsContent value="normal">
            <FormProvider {...normalForm.form}>
              <form onSubmit={normalForm.handleSubmit}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="space-y-6">
                      <FormImage
                        onImageUpload={normalForm.handleImageSelect}
                        onImageRemove={normalForm.removeImage}
                        isUploading={normalForm.isUploading}
                      />
                      <FormInfo />
                      <FormVariants />
                      <FormInventory />
                    </div>
                  </div>
                  <div className="space-y-6 lg:col-span-1">
                    <FormTags />
                    <FormPrice />
                  </div>
                </div>
              </form>
            </FormProvider>
          </TabsContent>
        </Tabs>

        {/* Desktop Form */}
        <div className="hidden lg:block">
          <FormProvider {...normalForm.form}>
            <form onSubmit={normalForm.handleSubmit}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <FormImage
                      onImageUpload={normalForm.handleImageSelect}
                      onImageRemove={normalForm.removeImage}
                      isUploading={normalForm.isUploading}
                    />
                    <FormInfo />
                    <FormVariants />
                    <FormInventory />
                  </div>
                </div>
                <div className="space-y-6 lg:col-span-1">
                  <FormTags />
                  <FormPrice />
                  <Button
                    size="lg"
                    type="submit"
                    disabled={
                      normalForm.form.formState.isSubmitting ||
                      normalForm.isUploading
                    }
                    className="bg-primary text-primary-foreground mt-6 w-full font-medium disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {normalForm.form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Spinner />
                        "建立中..."
                      </div>
                    ) : (
                      "建立商品"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Mobile Bottom Button */}
        <div className="bg-muted fixed inset-x-0 bottom-0 z-50 block p-4 lg:hidden">
          <Button
            onClick={currentForm.handleSubmit}
            disabled={
              currentForm.form.formState.isSubmitting || currentForm.isUploading
            }
            className="bg-primary text-primary-foreground w-full font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currentForm.form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner />
                "建立中..."
              </div>
            ) : (
              "建立商品"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Spinner from "@/components/ui/spinner";
import { useProductForm } from "@/hooks/useProductForm";
import type { Dispatch, SetStateAction } from "react";

interface DeleteActionProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  productId: string;
  prodcutName: string;
}

const DeleteAction = ({
  open,
  setOpen,
  productId,
  prodcutName,
}: DeleteActionProps) => {
  const { deleteMutation } = useProductForm();
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            確定要刪除<span className="text-emerald-600"> {prodcutName}</span>
            嗎？
          </AlertDialogTitle>
          <AlertDialogDescription>
            此操作無法復原，商品資料將永久刪除。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            取消
          </AlertDialogCancel>

          <AlertDialogAction
            className="bg-rose-800 hover:bg-rose-800/80"
            disabled={deleteMutation.isPending}
            onClick={() =>
              deleteMutation.mutate(productId, {
                onSuccess: () => setOpen(false),
              })
            }
          >
            {deleteMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Spinner />
                "刪除中..."
              </div>
            ) : (
              "確定刪除"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAction;

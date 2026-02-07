import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { login, logout as logoutApi, signup } from "../services/apiAuth";
import { toast } from "sonner";

// 登入 Hook
export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      // 儲存用戶資料到 query cache
      queryClient.setQueryData(["user"], data.user);

      toast.success("登入成功！");
      navigate({ to: "/products" });
    },
    onError: (error: Error) => {
      console.error("登入失敗:", error);
      toast.error(error.message || "登入失敗，請重試");
    },
  });

  return { loginMutation, isPending };
}

// 註冊 Hook
export function useSignup() {
  const navigate = useNavigate();

  const { mutate: signupMutation, isPending } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signup(email, password),
    onSuccess: () => {
      toast.success("註冊成功！");

      // 如果不需要郵件驗證，可以直接導向登入
      // 延遲導向讓用戶看到成功訊息
      setTimeout(() => {
        navigate({ to: "/login" });
      }, 2000);
    },
    onError: (error: Error) => {
      console.error("註冊失敗:", error);

      // 根據錯誤類型給出更友善的訊息
      let errorMessage = "註冊失敗，請重試";

      if (error.message.includes("already registered")) {
        errorMessage = "此電子郵件已被註冊";
      } else if (error.message.includes("invalid")) {
        errorMessage = "電子郵件格式無效";
      } else if (error.message.includes("password")) {
        errorMessage = "密碼格式不符合要求";
      }

      toast.error(errorMessage);
    },
  });

  return { signupMutation, isPending };
}

// 登出 Hook
export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // 清除所有 query cache
      queryClient.clear();

      toast.success("已登出");
      navigate({ to: "/login" });
    },
    onError: (error: Error) => {
      console.error("登出失敗:", error);
      toast.error("登出失敗，請重試");
    },
  });

  return { logout: () => logout(), isPending };
}

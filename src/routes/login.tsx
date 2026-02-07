import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLogin, useSignup } from "../hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { loginMutation, isPending: isLoginPending } = useLogin();
  const { signupMutation, isPending: isSignupPending } = useSignup();

  const isLoading = isLoginPending || isSignupPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (isLogin) {
        // 登入
        if (!email || !password) {
          setError("請填寫所有欄位");
          return;
        }

        loginMutation({ email, password });
      } else {
        // 註冊
        if (!email || !password || !confirmPassword) {
          setError("請填寫所有欄位");
          return;
        }

        if (password !== confirmPassword) {
          setError("密碼不一致");
          return;
        }

        if (password.length < 6) {
          setError("密碼至少需要 6 個字元");
          return;
        }

        // 驗證郵箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("請輸入有效的電子郵件地址");
          return;
        }

        signupMutation({ email, password });
      }
    } catch (err) {
      console.error("錯誤:", err);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6 p-4">
      <form onSubmit={handleSubmit}>
        <div className="bg-base-200 border-base-300 rounded-box rounded-2xl border p-6 shadow-lg">
          <div className="mb-8 flex justify-center text-2xl font-semibold">
            {isLogin ? "登入帳戶" : "註冊帳戶"}
          </div>

          {error && (
            <div className="mt-4">
              <span>{error}</span>
            </div>
          )}

          <Label className="my-4">
            <span>電子信箱</span>
          </Label>
          <Input
            type="email"
            className="w-full"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <Label className="my-4">
            <span className="">密碼</span>
          </Label>
          <Input
            type="password"
            className="w-full"
            autoComplete="on"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
          />

          {!isLogin && (
            <>
              <Label className="my-4">
                <span>確認密碼</span>
              </Label>
              <Input
                type="password"
                className="w-full"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </>
          )}

          <Button
            type="submit"
            className="btn btn-neutral mt-6 w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : isLogin ? (
              "登入"
            ) : (
              "註冊"
            )}
          </Button>

          <div className="divider my-6 flex items-center justify-center">
            或
          </div>

          <Button
            variant={"link"}
            className="btn btn-ghost w-full"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
              setPassword("");
              setConfirmPassword("");
            }}
            disabled={isLoading}
          >
            {isLogin ? "還沒有帳戶？註冊" : "已有帳戶？登入"}
          </Button>
        </div>
      </form>
    </div>
  );
}

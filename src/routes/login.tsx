import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  // function handleSubmit() {}

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-6">
      <form>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
          <legend className="fieldset-legend">登入帳戶</legend>

          <label className="label">電子信箱</label>
          <input type="email" className="input w-full" placeholder="Email" />

          <label className="label mt-4">密碼</label>
          <input
            type="password"
            className="input w-full"
            placeholder="Password"
          />

          <button className="btn btn-neutral mt-4">登入</button>
        </fieldset>
      </form>
    </div>
  );
}

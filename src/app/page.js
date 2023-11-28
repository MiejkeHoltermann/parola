import LoginForm from "./components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }
  return (
    <main>
      <h1 className="font-bold my-4">
        Um die App optimal nutzen zu können, logge dich jetzt ein.
      </h1>
      <LoginForm />
    </main>
  );
}

import LoginForm from "./components/LoginForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Image from "next/image";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/home");
  }
  return (
    <main>
      <Image
        src="/parola_logo.png"
        alt="Parola Logo"
        width={400}
        height={200}
        style={{ width: "40vw", marginTop: "2rem" }}
      />
      <LoginForm />
    </main>
  );
}

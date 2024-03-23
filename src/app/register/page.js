import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import RegisterForm from "../components/RegisterForm";

export default async function Register() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/home");
  }

  return (
    <main>
      <Image
        src="/parola_logo.png"
        alt="parola logo"
        width={400}
        height={200}
        style={{ width: "40vw", margin: "2rem 0" }}
      />
      <RegisterForm />
    </main>
  );
}

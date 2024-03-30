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
      <div className="relative bg-white w-[90%] min-h-[80vh] h-auto rounded-xl flex flex-col items-center py-[2rem] px-[1rem] gap-[1.6rem] mt-[5.4rem] mb-[6vh]">
        <Image
          src="/parola_logo.png"
          alt="parola logo"
          width={400}
          height={200}
          style={{ width: "50%", margin: "2rem 0" }}
        />
        <RegisterForm />
      </div>
    </main>
  );
}

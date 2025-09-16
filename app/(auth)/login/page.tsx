import Link from "next/link";
import TypingAnimation from "@/components/ui/typing-animation";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import LoginForm from "./LoginForm";
import { login } from "../actions";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { Logo } from "@/components/logo";

export default async function LoginPage() {
  const headersList = await headers();
  const barbershopId = headersList.get("x-barbershop-id");
  console.log(
    "Login page - headers:",
    Object.fromEntries(headersList.entries())
  );
  console.log("Login page - barbershopId:", barbershopId);

  let barbershop = null;
  if (barbershopId) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("barbershops")
      .select("*")
      .eq("id", barbershopId)
      .single();
    console.log("Login page - barbershop data:", data);
    barbershop = data;
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden h-screen bg-muted w-2/3 lg:block relative overflow-hidden">
        <div className="flex flex-col justify-between items-start h-full relative z-10 p-12">
          <div className="flex flex-col gap-1">
            <Link href={"/"} className="font-ff text-xl text-primary">
              <Logo />
            </Link>
            <Link href={"/"} className="font-ff text-3xl">
              {barbershop ? barbershop.name : "fadely"}
            </Link>
          </div>
          <TypingAnimation
            className="text-lg font-semibold"
            text={
              barbershop
                ? "Welcome back to your barbershop dashboard."
                : "Keep your loyal customers happy and satisfied."
            }
            duration={90}
          />
        </div>
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.5}
          duration={3}
          repeatDelay={1}
          className={cn(
            "absolute inset-0 z-0 inset-y-[-40%]",
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "h-[200%] w-full skew-y-12"
          )}
        />
      </div>

      <div className="flex items-center justify-center w-full lg:w-2/3 py-12">
        <div className="mx-auto grid w-[370px] gap-6">
          <div className="gap-6 text-center flex flex-col items-center">
            <Logo />
            <h1 className="text-3xl font-bold">
              {barbershop ? `${barbershop.name}` : "Login"}
            </h1>
            <p className="text-muted-foreground text-sm w-full">
              {barbershop
                ? "Enter your credentials to access your barbershop dashboard"
                : "Enter your email below to login to your account"}
            </p>
          </div>
          <LoginForm login={login} />
          {!barbershop && (
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

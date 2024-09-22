import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import TypingAnimation from "@/components/ui/typing-animation";
import {signup} from "../actions";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import {cn} from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden h-screen bg-muted w-2/3 lg:block relative overflow-hidden">
        <div className="flex flex-col justify-between items-start h-full relative z-10 p-12">
          <Link href={"/"} className="font-ff text-3xl">
            trimly
          </Link>
          <TypingAnimation className="text-lg font-semibold" text="Keep your loyal customers happy and satisfied." duration={90} />
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
      <div className="flex items-center justify-center w-2/3 py-12">
        <div className="mx-auto grid w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">Enter your email below to create an account</p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="yourname@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm password</Label>
              </div>
              <Input id="confirm-password" type="password" required />
            </div>
            <Button type="submit" formAction={signup} className="w-full">
              Create account
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

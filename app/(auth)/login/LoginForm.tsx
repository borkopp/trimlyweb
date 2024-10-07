"use client";
import {useState} from "react";
import Link from "next/link";
import {useFormStatus} from "react-dom";
import {useToast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Mail} from "lucide-react";
import PasswordInput from "./PasswordInput";

export default function LoginForm({login}: {login: (formData: FormData) => Promise<{error?: string}>}) {
  const [error, setError] = useState<string | null>(null);
  const {toast} = useToast();

  async function handleSubmit(formData: FormData) {
    setError(null);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful",
          description: "You have been logged in",
        });
      }
    } catch (error) {
      setError("An unexpected error occurred");
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="grid gap-4">
        <div className="relative">
          <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10" />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <div>
          <PasswordInput id="password" name="password" placeholder="Password" />
        </div>
        <SubmitButton />
      </div>
    </form>
  );
}

function SubmitButton() {
  const {pending} = useFormStatus();

  return (
    <Button type="submit" className={`w-full mb-4 mt-8 ${pending ? "bg-gray-500" : "bg-[#EA580C]"}`} disabled={pending}>
      {pending ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
        </div>
      ) : (
        "Login"
      )}
    </Button>
  );
}

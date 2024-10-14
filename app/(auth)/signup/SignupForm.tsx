"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Mail, Lock, Eye, EyeOff} from "lucide-react";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";

interface SignupFormProps {
  signup: (formData: FormData) => Promise<{error?: string; success?: string}>;
}

export default function SignupForm({signup}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);
    setIsLoading(false);

    if (result.error) {
      console.error("Signup error:", result.error);
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else if (result.success) {
      toast({
        title: "Success",
        description: result.success,
      });
      // Redirect to login page after successful signup
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="relative">
        <Input id="email" name="email" type="email" placeholder="Email" required className="pl-10" />
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>
      <div className="relative">
        <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Password" required className="pl-10 pr-10" />
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <div className="relative">
        <Input
          id="confirm-password"
          name="confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm password"
          required
          className="pl-10 pr-10"
        />
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <Button type="submit" className={`w-full mb-4 mt-8 ${isLoading ? "bg-gray-500" : "bg-primary"}`} disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary self-center"></div>
          </div>
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}

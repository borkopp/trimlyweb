"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {signOut} from "@/app/(auth)/actions";
import {toast} from "@/components/ui/use-toast";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await signOut();
      if (result.success) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      onSelect={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      disabled={isLoading}>
      <div className={`text-red-500 ${isLoading ? "opacity-50" : ""}`}>Logout</div>
    </DropdownMenuItem>
  );
}

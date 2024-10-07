"use client";
import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Lock, Eye, EyeOff} from "lucide-react";

export default function PasswordInput({id, name, placeholder}: {id: string; name: string; placeholder: string}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input id={id} name={name} type={showPassword ? "text" : "password"} placeholder={placeholder} required className="pl-10 pr-10" />
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

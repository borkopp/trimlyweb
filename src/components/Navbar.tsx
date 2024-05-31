import React from "react";
import Image from "next/image";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="w-full h-14 flex items-center justify-between border-b px-32">
      <Link href="/" className="font-ff text-2xl cursor-pointer">
        trimly
      </Link>
      <div className="flex gap-2">
        {/* <ModeToggle /> */}
        <Link href={"/login"}>
          <Button size={"sm"} variant="link">
            Log in
          </Button>
        </Link>
        <Link href="/signup">
          <Button size={"sm"} variant="secondary">
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  );
}

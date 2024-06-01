import React from "react";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { LanguageToggle } from "./language-toggle";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <div className="w-full h-14 sticky top-0 backdrop-filter backdrop-blur-sm bg-black/20 z-50 flex items-center justify-between border-b px-72">
      <div className="w-full h-full flex justify-between items-center">
        <Link href="/" className="font-ff text-2xl cursor-pointer">
          trimly
        </Link>
        <div className="flex gap-2">
          <div className="mr-4 items-center flex">
            <LanguageToggle />
            <ModeToggle />
          </div>
          {data.user ? (
            <Button
              variant="outline"
              className="w-32"
              onClick={() => supabase.auth.signOut()}
            >
              Sign Out
            </Button>
          ) : (
            <Link href={"/login"}>
              <Button size={"sm"} variant="link">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

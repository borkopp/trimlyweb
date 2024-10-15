import React from "react";
import {ModeToggle} from "./theme-toggle";
import Link from "next/link";
import {Button} from "./ui/button";
import {LanguageToggle} from "./language-toggle";
import {createClient} from "@/utils/supabase/server";
import {signOut} from "@/app/(auth)/actions";

export default async function Navbar() {
  const supabase = createClient();
  const {data} = await supabase.auth.getUser();

  return (
    <div className="w-full h-16 sticky top-0 backdrop-filter backdrop-blur-md bg-black/20 z-50 flex items-center justify-between border-b px-4 sm:px-8 md:px-16 lg:px-72">
      <div className="w-full h-full flex justify-between items-center">
        <Link href="/" className="font-ff text-2xl cursor-pointer text-primary">
          fadely
        </Link>
        <div className="flex gap-2 items-center">
          {/* <div className="mr-4 items-center flex">
            <LanguageToggle />
          </div> */}
          {data.user ? (
            <>
              <form action={signOut}>
                <Button variant="link" size="sm" className="text-sm" type="submit">
                  Sign Out
                </Button>
              </form>
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="outline" className="hover:text-primary">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

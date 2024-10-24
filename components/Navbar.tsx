import React from "react";
import Link from "next/link";
import {Button} from "./ui/button";
import {createClient} from "@/utils/supabase/server";
import {signOut} from "@/app/(auth)/actions";

export default async function Navbar() {
  const supabase = createClient();
  const {data} = await supabase.auth.getUser();

  return (
    <div className="w-full h-16 sticky top-0 backdrop-filter backdrop-blur-md bg-black/20 z-50 flex items-center justify-between border-b px-4 sm:px-8 md:px-16 lg:px-72">
      <div className="w-full max-w-[120rem] mx-auto h-full flex justify-between items-center">
        <Link href="/" className="font-ff text-2xl cursor-pointer text-primary">
          fadely
        </Link>
        <div>
          <Link href="#solution">
            <Button variant="ghost" size="sm" className="text-sm text-neutral-500">
              Features
            </Button>
          </Link>
          <Link href="#pricing">
            <Button variant="ghost" size="sm" className="text-sm text-neutral-500">
              Pricing
            </Button>
          </Link>
          <Link href="#faq">
            <Button variant="ghost" size="sm" className="text-sm text-neutral-500">
              FAQ
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" size="sm" className="text-sm text-neutral-500">
              Contact
            </Button>
          </Link>
        </div>
        {/* <div className="flex gap-4 items-center font-lato text-sm">
          <Link className="hover:text-primary" href="/features">
            Features
          </Link>
          <Link className="hover:text-primary" href="#pricing">
            Pricing
          </Link>
          <Link className="hover:text-primary" href="#faq">
            FAQ
          </Link>
          <Link className="hover:text-primary" href="#contact">
            Contact
          </Link>
        </div> */}
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
            <>
              <Link href="/login">
                <Button size="sm" variant="default">
                  Log in
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

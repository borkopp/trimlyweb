import {redirect} from "next/navigation";
import {createClient} from "@/utils/supabase/server";

export default async function AuthLayout({children}: {children: React.ReactNode}) {
  const supabase = createClient();
  const {data} = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}

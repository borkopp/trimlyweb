"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = createClient();
  const headersList = headers();
  const barbershopId = headersList.get("x-barbershop-id");

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }

  // If we're on a barbershop subdomain, verify the user belongs to this barbershop
  if (barbershopId && signInData.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('barbershop_id')
      .eq('id', signInData.user.id)
      .single();

    if (!profile || profile.barbershop_id !== parseInt(barbershopId)) {
      // Sign out the user since they don't belong to this barbershop
      await supabase.auth.signOut();
      return { error: "You don't have access to this barbershop" };
    }
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { error: error.message };
  }

  if (signUpData.user && signUpData.user.identities && signUpData.user.identities.length === 0) {
    return { error: "Email already in use" };
  }

  console.log("Signup data:", signUpData);
  return { success: "Check your email to confirm your account" };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { success: true };
}

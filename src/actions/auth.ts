"use server";

import { redirect } from "next/navigation";
import { loginAdmin, logoutAdmin } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });
  if (!result.success) redirect("/admin/login?error=Please%20enter%20a%20valid%20email%20and%20password.");

  const ok = await loginAdmin(result.data.email, result.data.password);
  if (!ok) redirect("/admin/login?error=Invalid%20email%20or%20password.");
  redirect("/admin");
}

export async function logoutAction() {
  await logoutAdmin();
  redirect("/admin/login");
}

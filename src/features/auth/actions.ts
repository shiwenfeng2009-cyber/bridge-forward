"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { loginSchema, profileSchema, registerSchema } from "./schemas";
import { type AuthActionState, friendlyAuthError } from "./state";
import { signOutSession } from "./logout";

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function studentIdEmail(identifier: string) {
  const safeId = identifier.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  return `${safeId}@student-id.bridge-forward.local`;
}

function normalizePhone(identifier: string) {
  return identifier.trim().replace(/[^\d+]/g, "");
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    identifierType: formValue(formData, "identifierType"),
    identifier: formValue(formData, "identifier"),
    password: formValue(formData, "password"),
    identityMode: formValue(formData, "identityMode"),
    displayName: formValue(formData, "displayName"),
    nativeLanguage: formValue(formData, "nativeLanguage"),
    grade: formValue(formData, "grade"),
    interests: formValue(formData, "interests").split(",").map((value) => value.trim()).filter(Boolean),
  });

  if (!parsed.success) return { ok: false, message: "请检查必填信息。Please check the required fields." };

  const supabase = await createClient();
  const origin = formValue(formData, "origin") || process.env.NEXT_PUBLIC_SITE_URL || "";
  const nickname = parsed.data.displayName || "匿名同学";
  const authOptions = {
    data: {
      identity_mode: parsed.data.identityMode,
      identifier_type: parsed.data.identifierType,
      display_name: nickname,
      native_language: parsed.data.nativeLanguage,
      grade: parsed.data.grade ?? null,
      interests: parsed.data.interests,
    },
    emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
  };
  const { data, error } = parsed.data.identifierType === "phone"
    ? await supabase.auth.signUp({ phone: normalizePhone(parsed.data.identifier), password: parsed.data.password, options: authOptions })
    : await supabase.auth.signUp({
        email: parsed.data.identifierType === "student_id" ? studentIdEmail(parsed.data.identifier) : parsed.data.identifier,
        password: parsed.data.password,
        options: authOptions,
      });

  if (error || !data.user) {
    return { ok: false, message: friendlyAuthError(error?.code, "暂时无法创建账号。Unable to create the account right now.") };
  }

  if (data.session) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      nickname,
      native_language: parsed.data.nativeLanguage,
      grade: parsed.data.grade ?? null,
      interests: parsed.data.interests,
      role: "student",
    }, { onConflict: "id" });
    revalidatePath("/", "layout");
  }

  return {
    ok: true,
    message: data.session
      ? "账号创建成功，已登录。Account created and signed in."
      : "注册成功！请检查邮箱并点击确认链接。Registration successful—check your email to continue.",
  };
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    identifierType: formValue(formData, "identifierType"),
    identifier: formValue(formData, "identifier"),
    password: formValue(formData, "password"),
  });
  if (!parsed.success) return { ok: false, message: "请输入账号和密码。Please enter your account and password." };

  const supabase = await createClient();
  const credentials = parsed.data.identifierType === "phone"
    ? { phone: normalizePhone(parsed.data.identifier), password: parsed.data.password }
    : {
        email: parsed.data.identifierType === "student_id" ? studentIdEmail(parsed.data.identifier) : parsed.data.identifier,
        password: parsed.data.password,
      };
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  if (error || !data.user || !data.session) {
    return { ok: false, message: friendlyAuthError(error?.code, "登录失败。Unable to sign in.") };
  }

  const metadata = data.user.user_metadata;
  await supabase.from("profiles").upsert({
    id: data.user.id,
    nickname: typeof metadata.display_name === "string" && metadata.display_name.trim()
      ? metadata.display_name.trim().slice(0, 30)
      : (data.user.email?.split("@")[0] || data.user.phone || "Bridge Student").slice(0, 30),
    native_language: typeof metadata.native_language === "string" && metadata.native_language.trim()
      ? metadata.native_language.trim().slice(0, 40)
      : "未设置 / Not set",
    grade: typeof metadata.grade === "number" ? metadata.grade : null,
    interests: Array.isArray(metadata.interests) ? metadata.interests.slice(0, 8) : [],
    role: "student",
  }, { onConflict: "id", ignoreDuplicates: true });

  revalidatePath("/", "layout");
  redirect("/ask?auth=logged-in");
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const parsed = profileSchema.safeParse({
    nickname: formValue(formData, "nickname"),
    nativeLanguage: formValue(formData, "nativeLanguage"),
    grade: formValue(formData, "grade"),
    interests: formValue(formData, "interests").split(",").map((value) => value.trim()).filter(Boolean),
  });
  if (!parsed.success) redirect("/account?status=invalid");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth=required#sign-in");

  const { error } = await supabase.from("profiles").update({
    nickname: parsed.data.nickname,
    native_language: parsed.data.nativeLanguage,
    grade: parsed.data.grade ?? null,
    interests: parsed.data.interests,
  }).eq("id", user.id);
  if (error) redirect("/account?status=error");

  revalidatePath("/", "layout");
  revalidatePath("/account");
  redirect("/account?status=saved");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await signOutSession(supabase);
  revalidatePath("/", "layout");
  redirect("/");
}

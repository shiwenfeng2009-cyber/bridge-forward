"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { loginSchema, registerSchema } from "./schemas";

type AuthActionState = {
  ok: boolean;
  message: string;
};

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
    interests: formValue(formData, "interests")
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "请检查必填信息。Please check the required fields.",
    };
  }

  const supabase = await createClient();
  const origin = formValue(formData, "origin") || process.env.NEXT_PUBLIC_SITE_URL || "";

  const nickname =
    parsed.data.identityMode === "anonymous"
      ? parsed.data.displayName || "匿名同学"
      : parsed.data.displayName;

  if (nickname.trim().length < 2) {
    return { ok: false, message: "请输入姓名或昵称。Please enter a name or nickname." };
  }

  const authOptions = {
    data: {
      identity_mode: parsed.data.identityMode,
      identifier_type: parsed.data.identifierType,
    },
    emailRedirectTo: origin ? `${origin}/auth/confirm` : undefined,
  };

  const { data, error } =
    parsed.data.identifierType === "phone"
      ? await supabase.auth.signUp({
          phone: normalizePhone(parsed.data.identifier),
          password: parsed.data.password,
          options: authOptions,
        })
      : await supabase.auth.signUp({
          email:
            parsed.data.identifierType === "student_id"
              ? studentIdEmail(parsed.data.identifier)
              : parsed.data.identifier,
          password: parsed.data.password,
          options: authOptions,
        });

  if (error || !data.user) {
    return {
      ok: false,
      message: "暂时无法创建账号。Unable to create the account right now.",
    };
  }

  const profileResult = await supabase.from("profiles").insert({
    id: data.user.id,
    nickname,
    native_language: parsed.data.nativeLanguage,
    grade: parsed.data.grade ?? null,
    interests: parsed.data.interests,
    role: "student",
  });

  if (profileResult.error) {
    return {
      ok: false,
      message: "账号已创建，但资料保存失败。Please sign in later and finish your profile.",
    };
  }

  revalidatePath("/");
  return {
    ok: true,
    message: "请检查你的 email 完成验证。Check your email to continue.",
  };
}

export async function submitRegisterAction(formData: FormData): Promise<void> {
  await registerAction({ ok: false, message: "" }, formData);
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

  if (!parsed.success) {
    return {
      ok: false,
      message: "请输入 email 和密码。Please enter your email and password.",
    };
  }

  const supabase = await createClient();
  const credentials =
    parsed.data.identifierType === "phone"
      ? { phone: normalizePhone(parsed.data.identifier), password: parsed.data.password }
      : {
          email:
            parsed.data.identifierType === "student_id"
              ? studentIdEmail(parsed.data.identifier)
              : parsed.data.identifier,
          password: parsed.data.password,
        };
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return {
      ok: false,
      message: "登录失败。Unable to sign in.",
    };
  }

  revalidatePath("/");
  return {
    ok: true,
    message: "登录成功。Welcome back.",
  };
}

export async function submitLoginAction(formData: FormData): Promise<void> {
  const result = await loginAction({ ok: false, message: "" }, formData);
  if (result.ok) {
    redirect("/ask");
  }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Unable to sign out.");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

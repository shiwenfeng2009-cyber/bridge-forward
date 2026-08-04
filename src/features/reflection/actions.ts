"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type { ReflectionMood } from "./options";

export type ReflectionActionState = {
  ok: boolean;
  message: string;
};

const validMoods = new Set<ReflectionMood>([
  "calm",
  "lonely",
  "anxious",
  "confused",
  "need_help",
]);

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field : "";
}

export async function saveReflectionAction(
  _previousState: ReflectionActionState,
  formData: FormData,
): Promise<ReflectionActionState> {
  const mood = value(formData, "mood") as ReflectionMood;
  const note = value(formData, "note").trim();

  if (!validMoods.has(mood) || note.length > 500) {
    return {
      ok: false,
      message: "请检查你的选择和笔记长度。Please check your choice and note length.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "登录后才能保存。You can reflect without saving, or sign in to save privately.",
    };
  }

  const { error } = await supabase.from("reflection_entries").insert({
    user_id: user.id,
    mood,
    note: note || null,
  });

  if (error) {
    return {
      ok: false,
      message: "暂时无法保存。Unable to save right now.",
    };
  }

  revalidatePath("/ask/reflection");
  return {
    ok: true,
    message: "已私密保存。Saved privately.",
  };
}

export async function submitReflectionFormAction(formData: FormData): Promise<void> {
  await saveReflectionAction({ ok: false, message: "" }, formData);
}

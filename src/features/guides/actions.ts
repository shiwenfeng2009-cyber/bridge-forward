"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { parseChecklistToggleFormData } from "./checklist";

export type ChecklistActionState = {
  ok: boolean;
  message: string;
};

export async function toggleChecklistItemAction(
  _previousState: ChecklistActionState,
  formData: FormData,
): Promise<ChecklistActionState> {
  const parsed = parseChecklistToggleFormData(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message: "清单项目无效。Invalid checklist item.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "登录后才能保存清单进度。Sign in to save your checklist progress.",
    };
  }

  const { error } = await supabase.from("checklist_progress").upsert({
    user_id: user.id,
    item_id: parsed.data.itemId,
    completed: parsed.data.completed,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return {
      ok: false,
      message: "保存失败，请重试。Could not save. Please try again.",
    };
  }

  revalidatePath("/school-information");
  return {
    ok: true,
    message: "已保存。Saved.",
  };
}

export async function submitChecklistToggleAction(formData: FormData): Promise<void> {
  await toggleChecklistItemAction({ ok: false, message: "" }, formData);
}

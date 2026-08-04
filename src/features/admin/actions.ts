"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { buildModerationUpdate, moderationDecisionSchema } from "./moderation";

export type ModerationActionState = {
  ok: boolean;
  message: string;
};

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field : "";
}

export async function moderateContentAction(
  _previousState: ModerationActionState,
  formData: FormData,
): Promise<ModerationActionState> {
  const parsed = moderationDecisionSchema.safeParse({
    targetTable: value(formData, "targetTable"),
    targetId: value(formData, "targetId"),
    status: value(formData, "status"),
    note: value(formData, "note") || undefined,
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "审核操作无效。Invalid moderation action.",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "请先登录管理员账号。Please sign in as a moderator or admin.",
    };
  }

  const { targetTable, targetId, status, note } = parsed.data;
  const reviewedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from(targetTable)
    .update(
      buildModerationUpdate({
        decision: parsed.data,
        moderatorId: user.id,
        reviewedAt,
      }),
    )
    .eq("id", targetId);

  if (updateError) {
    return {
      ok: false,
      message: "审核失败。Unable to update moderation status.",
    };
  }

  await supabase.from("moderation_actions").insert({
    moderator_id: user.id,
    action: status,
    target_table: targetTable,
    target_id: targetId,
    note: note ?? null,
  });

  revalidatePath("/admin");
  return {
    ok: true,
    message: "审核状态已更新。Moderation status updated.",
  };
}

export async function submitModerationFormAction(formData: FormData): Promise<void> {
  await moderateContentAction({ ok: false, message: "" }, formData);
}

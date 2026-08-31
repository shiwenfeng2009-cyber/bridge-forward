"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { parseQuestionFormData, parseStoryFormData } from "./form-data";

export type CommunityActionState = {
  ok: boolean;
  message: string;
};

async function getPostingContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "匿名同学 / Anonymous";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("nickname").eq("id", user.id).maybeSingle();
    displayName = profile?.nickname || "Community Student";
  }
  return { supabase, user, displayName };
}

export async function submitQuestionAction(
  _previousState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const parsed = parseQuestionFormData(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        "请检查问题内容，不要包含电话号码、社交账号或私人信息。Please review your question and remove private contact details.",
    };
  }

  const { supabase, user, displayName } = await getPostingContext();
  const requestedDisplayName = formData.get("displayName");
  const publicDisplayName = typeof requestedDisplayName === "string" && requestedDisplayName.trim().length >= 2
    ? requestedDisplayName.trim().slice(0, 40)
    : displayName;

  const { error } = await supabase.from("questions").insert({
    author_id: user?.id ?? null,
    display_name: publicDisplayName,
    category: parsed.data.category,
    title: parsed.data.title,
    body: parsed.data.body,
    language: parsed.data.language,
    status: "approved",
  });

  if (error) {
    return {
      ok: false,
      message: "暂时无法提交问题。Unable to submit your question right now.",
    };
  }

  revalidatePath("/ask/questions");
  return {
    ok: true,
    message: "发布成功！你的问题现在已公开。Published — your question is now public.",
  };
}

export async function submitStoryAction(
  _previousState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const parsed = parseStoryFormData(formData);

  if (!parsed.success) {
    return {
      ok: false,
      message:
        "请检查故事内容，不要包含电话号码、社交账号或私人信息。Please review your story and remove private contact details.",
    };
  }

  const { supabase, user, displayName } = await getPostingContext();

  const { error } = await supabase.from("stories").insert({
    author_id: user?.id ?? null,
    display_name: parsed.data.publishAsAnonymous ? "匿名同学 / Anonymous" : displayName,
    title: parsed.data.title,
    body: parsed.data.body,
    language: parsed.data.language,
    publish_as_anonymous: parsed.data.publishAsAnonymous,
    status: "approved",
  });

  if (error) {
    return {
      ok: false,
      message: "暂时无法提交故事。Unable to submit your story right now.",
    };
  }

  revalidatePath("/ask/stories");
  return {
    ok: true,
    message: "故事已发布。Your story is now public.",
  };
}

export async function submitReplyAction(
  _previousState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const questionId = formData.get("questionId");
  const body = formData.get("body");
  if (typeof questionId !== "string" || !questionId || typeof body !== "string" || body.trim().length < 10) {
    return { ok: false, message: "请选择问题并至少写 10 个字。Choose a question and write at least 10 characters." };
  }
  const { supabase, user, displayName } = await getPostingContext();
  const { error } = await supabase.from("replies").insert({
    author_id: user?.id ?? null,
    display_name: displayName,
    question_id: questionId,
    story_id: null,
    body: body.trim(),
    language: "bilingual",
    status: "approved",
  });
  if (error) return { ok: false, message: "暂时无法发送回复。Unable to send your reply right now." };
  revalidatePath("/ask/questions");
  return { ok: true, message: "回复已公开。Your reply is now public." };
}

export async function postQuestionFormAction(formData: FormData): Promise<void> {
  await submitQuestionAction({ ok: false, message: "" }, formData);
}

export async function postStoryFormAction(formData: FormData): Promise<void> {
  await submitStoryAction({ ok: false, message: "" }, formData);
}

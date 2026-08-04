"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import { parseQuestionFormData, parseStoryFormData } from "./form-data";

export type CommunityActionState = {
  ok: boolean;
  message: string;
};

const notSignedInMessage =
  "请先登录后再发表。Please sign in before posting.";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
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

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, message: notSignedInMessage };
  }

  const { error } = await supabase.from("questions").insert({
    author_id: user.id,
    category: parsed.data.category,
    title: parsed.data.title,
    body: parsed.data.body,
    language: parsed.data.language,
    status: "pending",
  });

  if (error) {
    return {
      ok: false,
      message: "暂时无法提交问题。Unable to submit your question right now.",
    };
  }

  revalidatePath("/ask");
  return {
    ok: true,
    message: "已提交审核。Your question was submitted for review.",
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

  const { supabase, user } = await requireUser();
  if (!user) {
    return { ok: false, message: notSignedInMessage };
  }

  const { error } = await supabase.from("stories").insert({
    author_id: user.id,
    title: parsed.data.title,
    body: parsed.data.body,
    language: parsed.data.language,
    publish_as_anonymous: parsed.data.publishAsAnonymous,
    status: "pending",
  });

  if (error) {
    return {
      ok: false,
      message: "暂时无法提交故事。Unable to submit your story right now.",
    };
  }

  revalidatePath("/ask");
  return {
    ok: true,
    message: "故事已提交审核。Your story was submitted for review.",
  };
}

export async function postQuestionFormAction(formData: FormData): Promise<void> {
  await submitQuestionAction({ ok: false, message: "" }, formData);
}

export async function postStoryFormAction(formData: FormData): Promise<void> {
  await submitStoryAction({ ok: false, message: "" }, formData);
}

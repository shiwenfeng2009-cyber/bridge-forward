import { createClient } from "@/lib/supabase/server";

import {
  type PublicCard,
  type QuestionRow,
  type StoryRow,
  toPublicQuestionCards,
  toPublicStoryCards,
} from "./public-content";

export type PublicFeedItem = {
  id: string;
  questionId: string;
  author: string;
  role: string;
  text: string;
  time: string;
  category: string;
  isQuestion: boolean;
};

type FeedQuestionRow = {
  id: string;
  body: string;
  category: string;
  display_name: string | null;
  created_at: string;
};

type FeedReplyRow = {
  id: string;
  question_id: string;
  body: string;
  display_name: string | null;
  created_at: string;
};

export async function getPublicCommunityFeed(): Promise<PublicFeedItem[]> {
  try {
    const supabase = await createClient();
    const [{ data: questions, error: questionError }, { data: replies, error: replyError }] = await Promise.all([
      supabase.from("questions").select("id,body,category,display_name,created_at").eq("status", "approved").order("created_at", { ascending: true }).limit(100),
      supabase.from("replies").select("id,question_id,body,display_name,created_at").eq("status", "approved").order("created_at", { ascending: true }).limit(100),
    ]);
    if (questionError || replyError) return [];
    const questionRows = (questions ?? []) as FeedQuestionRow[];
    const categoryByQuestion = new Map(questionRows.map((question) => [question.id, question.category]));
    return [
      ...questionRows.map((question) => ({
        id: question.id,
        questionId: question.id,
        author: question.display_name || "匿名同学 / Anonymous",
        role: "New question · 新问题",
        text: question.body,
        time: question.created_at,
        category: question.category,
        isQuestion: true,
      })),
      ...((replies ?? []) as FeedReplyRow[]).map((reply) => ({
        id: reply.id,
        questionId: reply.question_id,
        author: reply.display_name || "匿名同学 / Anonymous",
        role: "Community reply · 社区回复",
        text: reply.body,
        time: reply.created_at,
        category: categoryByQuestion.get(reply.question_id) || "other",
        isQuestion: false,
      })),
    ].sort((a, b) => a.time.localeCompare(b.time));
  } catch {
    return [];
  }
}

export async function getApprovedQuestionCards(): Promise<PublicCard[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("id,title,body,category,status,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) return [];
    return toPublicQuestionCards(data as QuestionRow[]);
  } catch {
    return [];
  }
}

export async function getApprovedStoryCards(): Promise<PublicCard[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("stories")
      .select("id,title,body,status,publish_as_anonymous,created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data) return [];
    return toPublicStoryCards(data as StoryRow[]);
  } catch {
    return [];
  }
}

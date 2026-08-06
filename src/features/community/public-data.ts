import { createClient } from "@/lib/supabase/server";

import {
  type PublicCard,
  type QuestionRow,
  type StoryRow,
  toPublicQuestionCards,
  toPublicStoryCards,
} from "./public-content";

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

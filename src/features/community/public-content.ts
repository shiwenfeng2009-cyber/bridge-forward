import { publicAuthorLabel } from "./schemas";

export type QuestionRow = {
  id: string;
  title: string;
  body: string;
  category: string;
  status: string;
  created_at: string;
};

export type StoryRow = {
  id: string;
  title: string;
  body: string;
  status: string;
  publish_as_anonymous: boolean;
  created_at: string;
};

export type PublicCard = {
  id: string;
  title: string;
  body: string;
  authorLabel: string;
  createdAt: string;
  meta?: string;
};

function approvedOnly<T extends { status: string }>(rows: T[]) {
  return rows.filter((row) => row.status === "approved");
}

export function toPublicQuestionCards(rows: QuestionRow[]): PublicCard[] {
  return approvedOnly(rows).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    authorLabel: publicAuthorLabel({
      anonymous: true,
      nickname: "Student",
    }),
    createdAt: row.created_at,
    meta: row.category.replaceAll("_", " "),
  }));
}

export function toPublicStoryCards(rows: StoryRow[]): PublicCard[] {
  return approvedOnly(rows).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    authorLabel: publicAuthorLabel({
      anonymous: true,
      nickname: "Student",
    }),
    createdAt: row.created_at,
  }));
}

import { z } from "zod";

export const moderationStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "removed",
]);

export const contentLanguageSchema = z.enum(["zh", "en", "bilingual", "other"]);

export const questionCategorySchema = z.enum([
  "school_rules",
  "making_friends",
  "english_confidence",
  "culture_shock",
  "sat_ap_college",
  "feeling_lost",
  "share_what_helped",
]);

const directContactPattern =
  /(\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b|@[\w.-]+|snap(chat)?|instagram|discord|wechat|line\s+id)/i;

const safePublicText = z
  .string()
  .trim()
  .min(10)
  .max(3000)
  .refine((value) => !directContactPattern.test(value), {
    message: "Please do not include phone numbers, handles, or private contact details.",
  });

export const questionSchema = z
  .object({
    category: questionCategorySchema,
    title: z.string().trim().min(8).max(120),
    body: safePublicText.max(1800),
    language: contentLanguageSchema,
    status: moderationStatusSchema.default("approved"),
  })
  .strict();

export const storySchema = z
  .object({
    title: z.string().trim().min(5).max(120),
    body: safePublicText,
    language: contentLanguageSchema,
    publishAsAnonymous: z.boolean().default(true),
    status: moderationStatusSchema.default("approved"),
  })
  .strict();

export function getInitialReplyStatus({
  approvedReplyCount,
}: {
  approvedReplyCount: number;
}) {
  void approvedReplyCount;
  return "approved";
}

export const replySchema = z
  .object({
    body: safePublicText.max(1500),
    language: contentLanguageSchema,
    approvedReplyCount: z.number().int().min(0),
  })
  .transform((value) => ({
    body: value.body,
    language: value.language,
    status: getInitialReplyStatus({
      approvedReplyCount: value.approvedReplyCount,
    }),
  }));

export function publicAuthorLabel({
  anonymous,
  nickname,
}: {
  anonymous: boolean;
  nickname: string;
}) {
  return anonymous ? "匿名同学 / Anonymous" : nickname;
}

export type ModerationStatus = z.infer<typeof moderationStatusSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type StoryInput = z.infer<typeof storySchema>;
export type ReplyInput = z.infer<typeof replySchema>;

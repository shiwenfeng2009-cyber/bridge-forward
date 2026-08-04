import { z } from "zod";

export type AppRole = "student" | "verified_supporter" | "moderator" | "admin";

export const moderationQueues = [
  {
    key: "questions",
    title: "Pending Questions",
    description: "Review anonymous questions before they become public.",
  },
  {
    key: "stories",
    title: "Pending Stories",
    description: "Review student stories and remove identifying details before publishing.",
  },
  {
    key: "replies",
    title: "Pending Replies",
    description: "Review replies from new users before they appear publicly.",
  },
  {
    key: "reports",
    title: "Reports",
    description: "Review privacy, bullying, unsafe, spam, or other reports.",
  },
  {
    key: "supporter_applications",
    title: "Verified Supporter Applications",
    description: "Verify teachers, counselors, club advisors, and school staff.",
  },
] as const;

export type ModerationTargetTable = (typeof moderationQueues)[number]["key"];

export function canModerate(role: AppRole | null | undefined) {
  return role === "moderator" || role === "admin";
}

export const moderationDecisionSchema = z
  .object({
    targetTable: z.enum([
      "questions",
      "stories",
      "replies",
      "reports",
      "supporter_applications",
    ]),
    targetId: z.uuid(),
    status: z.enum(["approved", "rejected", "removed"]),
    note: z.string().trim().max(800).optional(),
  })
  .strict();

export type ModerationDecision = z.infer<typeof moderationDecisionSchema>;

export function buildModerationUpdate({
  decision,
  moderatorId,
  reviewedAt,
}: {
  decision: ModerationDecision;
  moderatorId: string;
  reviewedAt: string;
}) {
  if (decision.targetTable === "reports") {
    return { status: decision.status };
  }

  if (decision.targetTable === "supporter_applications") {
    return {
      status: decision.status === "removed" ? "rejected" : decision.status,
      reviewed_by: moderatorId,
      reviewed_at: reviewedAt,
    };
  }

  return {
    status: decision.status,
    moderation_note: decision.note ?? null,
    reviewed_by: moderatorId,
    reviewed_at: reviewedAt,
  };
}

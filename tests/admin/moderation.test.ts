import { describe, expect, it } from "vitest";

import {
  buildModerationUpdate,
  canModerate,
  moderationDecisionSchema,
  moderationQueues,
} from "@/features/admin/moderation";

describe("admin moderation helpers", () => {
  it("allows only moderators and admins to moderate", () => {
    expect(canModerate(null)).toBe(false);
    expect(canModerate(undefined)).toBe(false);
    expect(canModerate("student")).toBe(false);
    expect(canModerate("verified_supporter")).toBe(false);
    expect(canModerate("moderator")).toBe(true);
    expect(canModerate("admin")).toBe(true);
  });

  it("defines all first-version moderation queues", () => {
    expect(moderationQueues.map((queue) => queue.key)).toEqual([
      "questions",
      "stories",
      "replies",
      "reports",
      "supporter_applications",
    ]);
  });

  it("accepts safe moderation decisions", () => {
    const result = moderationDecisionSchema.safeParse({
      targetTable: "questions",
      targetId: "8d9d8e7e-6e0f-4a28-9f1a-33db6b8c2d41",
      status: "approved",
      note: "Approved after privacy check.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsupported target tables", () => {
    const result = moderationDecisionSchema.safeParse({
      targetTable: "profiles",
      targetId: "8d9d8e7e-6e0f-4a28-9f1a-33db6b8c2d41",
      status: "approved",
    });

    expect(result.success).toBe(false);
  });

  it("builds table-specific update payloads", () => {
    const reviewedAt = "2026-06-23T00:00:00.000Z";
    const moderatorId = "8d9d8e7e-6e0f-4a28-9f1a-33db6b8c2d41";

    expect(
      buildModerationUpdate({
        decision: {
          targetTable: "reports",
          targetId: "8d9d8e7e-6e0f-4a28-9f1a-33db6b8c2d41",
          status: "removed",
        },
        moderatorId,
        reviewedAt,
      }),
    ).toEqual({ status: "removed" });

    expect(
      buildModerationUpdate({
        decision: {
          targetTable: "supporter_applications",
          targetId: "8d9d8e7e-6e0f-4a28-9f1a-33db6b8c2d41",
          status: "removed",
        },
        moderatorId,
        reviewedAt,
      }),
    ).toEqual({
      status: "rejected",
      reviewed_by: moderatorId,
      reviewed_at: reviewedAt,
    });
  });
});

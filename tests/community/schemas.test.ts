import { describe, expect, it } from "vitest";

import {
  getInitialReplyStatus,
  publicAuthorLabel,
  questionSchema,
  replySchema,
  storySchema,
} from "@/features/community/schemas";

describe("community schemas and moderation rules", () => {
  it("creates ordinary questions in an immediately public state", () => {
    const result = questionSchema.safeParse({
      category: "making_friends",
      title: "I feel lonely at lunch. What should I do?",
      body: "I am new and I do not know where to sit.",
      language: "en",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("approved");
    }
    expect(publicAuthorLabel({ anonymous: true, nickname: "IslandBridge" })).toBe(
      "匿名同学 / Anonymous",
    );
  });

  it("creates ordinary stories in an immediately public state", () => {
    const result = storySchema.safeParse({
      title: "My first lunch alone",
      body: "I did not know where to sit during my first month.",
      language: "en",
      publishAsAnonymous: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("approved");
    }
  });

  it("publishes ordinary replies immediately", () => {
    expect(getInitialReplyStatus({ approvedReplyCount: 0 })).toBe("approved");
    expect(getInitialReplyStatus({ approvedReplyCount: 2 })).toBe("approved");
    expect(getInitialReplyStatus({ approvedReplyCount: 3 })).toBe("approved");
  });

  it("rejects public posts that include direct contact details", () => {
    const result = replySchema.safeParse({
      body: "Text me at 808-555-1212 after school.",
      language: "en",
      approvedReplyCount: 3,
    });

    expect(result.success).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import {
  toPublicQuestionCards,
  toPublicStoryCards,
} from "@/features/community/public-content";

describe("public community content", () => {
  it("shows only approved questions and keeps public author anonymous", () => {
    const cards = toPublicQuestionCards([
      {
        id: "approved-1",
        title: "How do I join a club if I do not know anyone?",
        body: "I am nervous about walking in alone.",
        category: "making_friends",
        status: "approved",
        created_at: "2026-06-23T10:00:00.000Z",
        profiles: { nickname: "IslandBridge" },
      },
      {
        id: "pending-1",
        title: "Pending question",
        body: "This should not be public yet.",
        category: "school_rules",
        status: "pending",
        created_at: "2026-06-24T10:00:00.000Z",
        profiles: { nickname: "PrivateAuthor" },
      },
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]).toMatchObject({
      id: "approved-1",
      authorLabel: "匿名同学 / Anonymous",
    });
  });

  it("shows only approved stories and respects anonymous story display", () => {
    const cards = toPublicStoryCards([
      {
        id: "story-1",
        title: "My first lunch alone",
        body: "I did not know where to sit, but later I found a club.",
        status: "approved",
        publish_as_anonymous: true,
        created_at: "2026-06-23T10:00:00.000Z",
        profiles: { nickname: "NewPath" },
      },
      {
        id: "story-2",
        title: "Rejected story",
        body: "This should not show.",
        status: "rejected",
        publish_as_anonymous: false,
        created_at: "2026-06-23T11:00:00.000Z",
        profiles: { nickname: "VisibleName" },
      },
    ]);

    expect(cards).toHaveLength(1);
    expect(cards[0]?.authorLabel).toBe("匿名同学 / Anonymous");
  });
});

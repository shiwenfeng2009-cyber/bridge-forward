import { describe, expect, it } from "vitest";

import { getUserDisplayName, getUserInitial } from "@/features/auth/profile";

const baseUser = { user_metadata: {}, email: null, phone: null };

describe("account display identity", () => {
  it("uses nickname, metadata, email, and phone in that order", () => {
    expect(getUserDisplayName({ ...baseUser, email: "mail@example.com", user_metadata: { display_name: "Metadata" } } as never, { nickname: "Nickname" })).toBe("Nickname");
    expect(getUserDisplayName({ ...baseUser, email: "mail@example.com", user_metadata: { display_name: "Metadata" } } as never)).toBe("Metadata");
    expect(getUserDisplayName({ ...baseUser, email: "mail@example.com" } as never)).toBe("mail@example.com");
    expect(getUserDisplayName({ ...baseUser, phone: "+18085550123" } as never)).toBe("+18085550123");
  });

  it("creates an avatar initial without exposing more account data", () => {
    expect(getUserInitial("IslandBridge")).toBe("I");
    expect(getUserInitial("小桥")).toBe("小");
  });
});

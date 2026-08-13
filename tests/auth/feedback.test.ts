import { describe, expect, it } from "vitest";

import { friendlyAuthError } from "@/features/auth/state";

describe("safe authentication feedback", () => {
  it("maps expected failures without returning raw provider details", () => {
    expect(friendlyAuthError("invalid_credentials")).toContain("Invalid");
    expect(friendlyAuthError("email_not_confirmed")).toContain("confirm your email");
    expect(friendlyAuthError("user_already_exists")).toContain("already exists");
    expect(friendlyAuthError("unexpected_internal_provider_detail")).toBe("暂时无法完成操作。Please try again.");
  });
});

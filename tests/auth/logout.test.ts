import { describe, expect, it, vi } from "vitest";

import { signOutSession } from "@/features/auth/logout";

describe("logout", () => {
  it("signs out through the cookie-aware Supabase client", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    await signOutSession({ auth: { signOut } });
    expect(signOut).toHaveBeenCalledOnce();
  });

  it("does not silently report a failed sign-out", async () => {
    await expect(signOutSession({ auth: { signOut: vi.fn().mockResolvedValue({ error: new Error("failed") }) } })).rejects.toThrow("Unable to sign out");
  });
});

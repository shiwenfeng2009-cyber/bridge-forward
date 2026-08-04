import { describe, expect, it } from "vitest";

import {
  loginSchema,
  profileSchema,
  registerSchema,
  supporterApplicationSchema,
} from "@/features/auth/schemas";

describe("auth and profile schemas", () => {
  it("requires only email, password, nickname, and native language for registration", () => {
    const result = registerSchema.safeParse({
      email: "new.student@example.com",
      password: "safe-password-123",
      nickname: "IslandBridge",
      nativeLanguage: "Chinese",
    });

    expect(result.success).toBe(true);
  });

  it("allows grade and interests as optional profile fields", () => {
    const result = profileSchema.safeParse({
      nickname: "NewPath",
      nativeLanguage: "Korean",
      grade: 10,
      interests: ["band", "robotics"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects unnecessary profile fields such as real name, school, or MBTI", () => {
    const result = profileSchema.safeParse({
      nickname: "TooMuchInfo",
      nativeLanguage: "Chinese",
      realName: "Private Student",
      school: "Hidden High School",
      mbti: "INFJ",
    });

    expect(result.success).toBe(false);
  });

  it("keeps login limited to email and password", () => {
    const result = loginSchema.safeParse({
      email: "student@example.com",
      password: "safe-password-123",
    });

    expect(result.success).toBe(true);
  });

  it("requires verified supporter applications to identify a school role without publishing private staff data", () => {
    const result = supporterApplicationSchema.safeParse({
      role: "counselor",
      schoolEmail: "supporter@example.edu",
      note: "I support multilingual students.",
    });

    expect(result.success).toBe(true);
  });
});

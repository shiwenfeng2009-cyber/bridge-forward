import { describe, expect, it } from "vitest";

import {
  loginSchema,
  profileSchema,
  registerSchema,
  supporterApplicationSchema,
} from "@/features/auth/schemas";

describe("auth and profile schemas", () => {
  it("requires account method, credentials, display name, and native language for registration", () => {
    const result = registerSchema.safeParse({
      identifierType: "gmail",
      identifier: "new.student@example.com",
      password: "safe-password-123",
      identityMode: "anonymous",
      displayName: "IslandBridge",
      nativeLanguage: "Chinese",
    });

    expect(result.success).toBe(true);
  });

  it("accepts only a valid email for public registration", () => {
    const base = {
      password: "safe-password-123",
      identityMode: "anonymous",
      displayName: "IslandBridge",
      nativeLanguage: "Chinese",
    };

    expect(registerSchema.safeParse({ ...base, identifierType: "phone", identifier: "+18085550100" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...base, identifierType: "gmail", identifier: "not-an-email" }).success).toBe(false);
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

  it("keeps login limited to account method, identifier, and password", () => {
    const result = loginSchema.safeParse({
      identifierType: "gmail",
      identifier: "student@example.com",
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

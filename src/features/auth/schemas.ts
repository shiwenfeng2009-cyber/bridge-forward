import { z } from "zod";

const optionalGradeSchema = z
  .preprocess((value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value === "string") return Number(value);
    return value;
  }, z.number().int().min(9).max(12).optional());

export const profileSchema = z
  .object({
    nickname: z.string().trim().min(2).max(30),
    nativeLanguage: z.string().trim().min(2).max(40),
    grade: optionalGradeSchema,
    interests: z.array(z.string().trim().min(1).max(30)).max(8).optional().default([]),
  })
  .strict();

export const registerSchema = profileSchema
  .omit({ nickname: true })
  .extend({
    identifierType: z.enum(["gmail", "phone", "student_id"]),
    identifier: z.string().trim().min(2).max(254),
    password: z.string().min(1).max(128),
    identityMode: z.enum(["real_name", "anonymous"]),
    displayName: z.string().trim().max(30).optional().default(""),
  })
  .strict();

export const loginSchema = z
  .object({
    identifierType: z.enum(["gmail", "phone", "student_id"]),
    identifier: z.string().trim().min(2).max(254),
    password: z.string().min(1).max(128),
  })
  .strict();

export const supporterApplicationSchema = z
  .object({
    role: z.enum(["teacher", "counselor", "club_advisor", "school_staff"]),
    schoolEmail: z.email().max(254),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export type ProfileInput = z.infer<typeof profileSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

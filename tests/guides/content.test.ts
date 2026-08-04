import { describe, expect, it } from "vitest";

import { checklistItems, guideSections } from "@/features/guides/content";

describe("School Information content", () => {
  it("labels every Moanalua-specific guide item with a source and review date", () => {
    const moanaluaItems = guideSections
      .flatMap((section) => section.items)
      .filter((item) => item.scope === "moanalua");

    expect(moanaluaItems.length).toBeGreaterThan(0);
    expect(
      moanaluaItems.every((item) => item.sourceUrl && item.reviewedOn),
    ).toBe(true);
  });

  it("includes the practical new student checklist tasks", () => {
    expect(checklistItems.map((item) => item.id)).toEqual([
      "know_counselor",
      "check_grades",
      "email_teacher",
      "understand_attendance",
      "explore_club",
      "know_help_routes",
    ]);
  });

  it("keeps guide content bilingual and clear", () => {
    for (const section of guideSections) {
      expect(section.title.zh).toBeTruthy();
      expect(section.title.en).toBeTruthy();
      for (const item of section.items) {
        expect(item.title.zh).toBeTruthy();
        expect(item.title.en).toBeTruthy();
        expect(item.body.zh.length).toBeGreaterThan(20);
        expect(item.body.en.length).toBeGreaterThan(20);
      }
    }
  });
});

import { describe, expect, it } from "vitest";

import {
  checklistItems,
  isChecklistItemId,
  mergeChecklistProgress,
  parseChecklistToggleFormData,
} from "@/features/guides/checklist";

describe("interactive checklist helpers", () => {
  it("recognizes only known checklist ids", () => {
    expect(isChecklistItemId("know_counselor")).toBe(true);
    expect(isChecklistItemId("unknown_task")).toBe(false);
  });

  it("merges saved progress into checklist display items", () => {
    const items = mergeChecklistProgress([
      { item_id: "know_counselor", completed: true },
      { item_id: "email_teacher", completed: true },
    ]);

    expect(items).toHaveLength(checklistItems.length);
    expect(items.find((item) => item.id === "know_counselor")?.completed).toBe(true);
    expect(items.find((item) => item.id === "check_grades")?.completed).toBe(false);
  });

  it("parses a valid checklist toggle", () => {
    const formData = new FormData();
    formData.set("itemId", "explore_club");
    formData.set("completed", "true");

    const result = parseChecklistToggleFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ itemId: "explore_club", completed: true });
    }
  });

  it("rejects unknown checklist item ids", () => {
    const formData = new FormData();
    formData.set("itemId", "real_name");
    formData.set("completed", "true");

    expect(parseChecklistToggleFormData(formData).success).toBe(false);
  });
});

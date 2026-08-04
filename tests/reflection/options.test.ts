import { describe, expect, it } from "vitest";

import {
  getReflectionSuggestion,
  reflectionOptions,
} from "@/features/reflection/options";

describe("Reflection Corner options", () => {
  it("provides the five confirmed reflection choices", () => {
    expect(Object.keys(reflectionOptions)).toEqual([
      "calm",
      "lonely",
      "anxious",
      "confused",
      "need_help",
    ]);
  });

  it("keeps all advice non-diagnostic and non-therapy-like", () => {
    const serialized = JSON.stringify(reflectionOptions).toLowerCase();

    expect(serialized).not.toMatch(/diagnos|treatment plan|you have|mental illness/);
    expect(serialized).not.toMatch(/therapy session|therapist/);
  });

  it("gives immediate resources for I need help without implying silent notification", () => {
    const suggestion = getReflectionSuggestion("need_help");

    expect(suggestion.resources).toContain("/resources#urgent-help");
    expect(JSON.stringify(suggestion).toLowerCase()).not.toMatch(/we notified|automatically notify|alerted/);
  });

  it("includes Chinese and English labels and practical next actions", () => {
    const lonely = getReflectionSuggestion("lonely");

    expect(lonely.label.zh).toBe("我有点孤单");
    expect(lonely.label.en).toBe("I feel lonely");
    expect(lonely.actions.length).toBeGreaterThanOrEqual(2);
  });
});

import { describe, expect, it } from "vitest";

import {
  parseQuestionFormData,
  parseStoryFormData,
} from "@/features/community/form-data";

describe("community form data parsing", () => {
  it("parses question form data into an approved public question", () => {
    const formData = new FormData();
    formData.set("category", "english_confidence");
    formData.set("title", "I am afraid to speak English in class");
    formData.set("body", "I worry that my classmates will not understand my accent.");
    formData.set("language", "en");

    const result = parseQuestionFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("approved");
      expect(result.data.category).toBe("english_confidence");
    }
  });

  it("parses story form data as anonymous and public by default", () => {
    const formData = new FormData();
    formData.set("title", "My first lunch alone");
    formData.set("body", "I did not know where to sit, but later I found a club room.");
    formData.set("language", "en");
    formData.set("publishAsAnonymous", "on");

    const result = parseStoryFormData(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.publishAsAnonymous).toBe(true);
      expect(result.data.status).toBe("approved");
    }
  });

  it("rejects question form data that includes contact details", () => {
    const formData = new FormData();
    formData.set("category", "making_friends");
    formData.set("title", "Can someone contact me after school?");
    formData.set("body", "My phone number is 808-555-1212.");
    formData.set("language", "en");

    const result = parseQuestionFormData(formData);

    expect(result.success).toBe(false);
  });
});

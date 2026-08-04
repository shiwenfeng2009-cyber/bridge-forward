import { questionSchema, storySchema } from "./schemas";

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field : "";
}

export function parseQuestionFormData(formData: FormData) {
  return questionSchema.safeParse({
    category: value(formData, "category"),
    title: value(formData, "title"),
    body: value(formData, "body"),
    language: value(formData, "language") || "bilingual",
  });
}

export function parseStoryFormData(formData: FormData) {
  return storySchema.safeParse({
    title: value(formData, "title"),
    body: value(formData, "body"),
    language: value(formData, "language") || "bilingual",
    publishAsAnonymous: formData.get("publishAsAnonymous") === "on",
  });
}

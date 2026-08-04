import { checklistItems as baseChecklistItems } from "./content";

export const checklistItems = baseChecklistItems;

export type ChecklistItemId = (typeof checklistItems)[number]["id"];

export type ChecklistProgressRow = {
  item_id: string;
  completed: boolean;
};

export function isChecklistItemId(value: string): value is ChecklistItemId {
  return checklistItems.some((item) => item.id === value);
}

export function mergeChecklistProgress(progressRows: ChecklistProgressRow[]) {
  const completedById = new Map(
    progressRows
      .filter((row) => isChecklistItemId(row.item_id))
      .map((row) => [row.item_id, row.completed]),
  );

  return checklistItems.map((item) => ({
    ...item,
    completed: completedById.get(item.id) ?? false,
  }));
}

export type ChecklistDisplayItem = ReturnType<typeof mergeChecklistProgress>[number];

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field : "";
}

export function parseChecklistToggleFormData(formData: FormData) {
  const itemId = value(formData, "itemId");
  const completed = value(formData, "completed") === "true";

  if (!isChecklistItemId(itemId)) {
    return { success: false as const, error: "Unknown checklist item" };
  }

  return {
    success: true as const,
    data: { itemId, completed },
  };
}

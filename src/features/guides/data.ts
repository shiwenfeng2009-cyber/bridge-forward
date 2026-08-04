import { createClient } from "@/lib/supabase/server";

import { mergeChecklistProgress } from "./checklist";

export async function getChecklistDisplayItems() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return mergeChecklistProgress([]);
    }

    const { data, error } = await supabase
      .from("checklist_progress")
      .select("item_id,completed")
      .eq("user_id", user.id);

    if (error || !data) {
      return mergeChecklistProgress([]);
    }

    return mergeChecklistProgress(data);
  } catch {
    return mergeChecklistProgress([]);
  }
}

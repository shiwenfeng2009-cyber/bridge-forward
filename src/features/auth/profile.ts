import type { User } from "@supabase/supabase-js";

type ProfileIdentity = { nickname?: string | null } | null;

export function getUserDisplayName(user: User, profile?: ProfileIdentity) {
  const metadataName = [
    user.user_metadata.display_name,
    user.user_metadata.full_name,
    user.user_metadata.name,
  ].find((value): value is string => typeof value === "string" && value.trim().length > 0);

  return profile?.nickname?.trim() || metadataName?.trim() || user.email || user.phone || "Account";
}

export function getUserInitial(displayName: string) {
  return Array.from(displayName.trim())[0]?.toLocaleUpperCase() || "?";
}

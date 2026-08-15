import { type NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") ?? "/ask";

  // Supabase's default hosted confirmation template verifies the email on the
  // Auth domain before redirecting here, so there is no code/token to exchange.
  // In that flow the account is active, but the user still needs to sign in.
  if (!code && !(tokenHash && type)) {
    return NextResponse.redirect(new URL("/?auth=confirmed#sign-in", request.url));
  }

  const supabase = await createClient();
  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : null;

  if (result && !result.error) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const metadata = user.user_metadata;
      await supabase.from("profiles").upsert({
        id: user.id,
        nickname: (typeof metadata.display_name === "string" && metadata.display_name.trim())
          ? metadata.display_name.trim().slice(0, 30)
          : (user.email?.split("@")[0] || user.phone || "Bridge Student").slice(0, 30),
        native_language: typeof metadata.native_language === "string" ? metadata.native_language.slice(0, 40) : "未设置 / Not set",
        grade: typeof metadata.grade === "number" ? metadata.grade : null,
        interests: Array.isArray(metadata.interests) ? metadata.interests.slice(0, 8) : [],
        role: "student",
      }, { onConflict: "id", ignoreDuplicates: true });
    }
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL("/?auth=confirmation-error#sign-in", request.url));
}

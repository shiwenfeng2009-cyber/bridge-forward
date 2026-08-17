import Link from "next/link";

import { updateProfileAction } from "@/features/auth/actions";
import { getUserDisplayName, getUserInitial } from "@/features/auth/profile";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <main className="section-page account-page">
        <section className="account-card notice-card">
          <h1>请先登录 / Sign in required</h1>
          <p>登录后才能查看和编辑你的个人资料。</p>
          <Link className="account-back-link" href="/sign-in">登录 / Sign in</Link>
        </section>
      </main>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname,native_language,grade,interests")
    .eq("id", user.id)
    .maybeSingle();
  const label = getUserDisplayName(user, profile);
  const status = (await searchParams).status;

  return (
    <main className="section-page account-page">
      <section className="account-card" aria-labelledby="account-heading">
        <header className="account-card__header">
          <span aria-hidden="true" className="account-card__avatar">{getUserInitial(label)}</span>
          <div><p className="eyebrow">YOUR BRIDGE FORWARD ACCOUNT</p><h1 id="account-heading">个人资料 / Profile</h1></div>
        </header>
        {status && <p className={`account-status account-status--${status}`} role="status">
          {status === "saved" ? "资料已保存。Profile saved." : status === "invalid" ? "请检查填写内容。Please check your entries." : "暂时无法保存，请稍后再试。Unable to save right now."}
        </p>}
        <form action={updateProfileAction} className="auth-form" id="settings">
          <label>昵称 / Nickname<input defaultValue={profile?.nickname || label} maxLength={30} minLength={2} name="nickname" required /></label>
          <label>邮箱或电话 / Email or phone<input disabled value={user.email || user.phone || "—"} /></label>
          <label>母语 / Native language<input defaultValue={profile?.native_language || "未设置 / Not set"} maxLength={40} minLength={2} name="nativeLanguage" required /></label>
          <label>年级 / Grade<input defaultValue={profile?.grade ?? ""} max={12} min={9} name="grade" type="number" /></label>
          <label>兴趣 / Interests<textarea defaultValue={(profile?.interests || []).join(", ")} name="interests" placeholder="band, art, bowling" /></label>
          <p className="account-privacy-note">账号角色和管理员权限只能由管理员在 Supabase 中设置。Role and admin permissions cannot be edited here.</p>
          <button type="submit">保存资料 / Save profile</button>
        </form>
      </section>
    </main>
  );
}

import Link from "next/link";

import { AuthActionForm } from "@/components/auth-action-form";

export default function SignInPage() {
  return (
    <main className="section-page auth-page">
      <section aria-labelledby="signin-heading" className="auth-card">
        <p className="eyebrow">Sign in</p>
        <h1 id="signin-heading">登录 Bridge Forward</h1>
        <p>登录后可以发布问题和故事，并管理自己的资料。</p>
        <AuthActionForm mode="login" />
        <p className="auth-card__footer">还没有账号？ <Link href="/register">Create account</Link></p>
      </section>
    </main>
  );
}

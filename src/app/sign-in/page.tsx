import Link from "next/link";

import { submitLoginAction } from "@/features/auth/actions";

export default function SignInPage() {
  return (
    <main className="section-page auth-page">
      <section className="auth-card" aria-labelledby="signin-heading">
        <p className="eyebrow">Sign in</p>
        <h1 id="signin-heading">登录 Bridge Forward</h1>
        <p>登录后可以发表问题、分享故事、回复公开内容，并保存自己的进度。</p>

        <form action={submitLoginAction} className="auth-form">
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          <button type="submit">Sign in</button>
        </form>

        <p className="auth-card__footer">
          还没有账号？ <Link href="/register">Create account</Link>
        </p>
      </section>
    </main>
  );
}

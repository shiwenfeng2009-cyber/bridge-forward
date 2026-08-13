import Link from "next/link";

import { AuthActionForm } from "@/components/auth-action-form";

export default function RegisterPage() {
  return (
    <main className="section-page auth-page">
      <section aria-labelledby="register-heading" className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1 id="register-heading">创建你的 Bridge Forward 账号</h1>
        <p>注册后请在邮箱中确认账号，再返回登录。</p>
        <AuthActionForm mode="register" />
        <p className="auth-card__footer">已经有账号？ <Link href="/sign-in">Sign in</Link></p>
      </section>
    </main>
  );
}

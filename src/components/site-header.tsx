import Link from "next/link";

import { AccountMenu } from "@/components/account-menu";
import { AuthActionForm } from "@/components/auth-action-form";
import { LanguageControl } from "@/components/language-control";

export type HeaderUser = { initial: string; label: string };

function AuthModal({ mode }: { mode: "login" | "register" }) {
  const id = mode === "login" ? "sign-in" : "create-account";
  return (
    <div className="auth-modal auth-modal--target" id={id}>
      <section aria-labelledby={`${id}-title`} aria-modal="true" className="auth-modal__panel" role="dialog">
        <a aria-label="关闭账号窗口" className="auth-modal__close" href="#">×</a>
        <p className="auth-modal__eyebrow">BRIDGE FORWARD ACCOUNT</p>
        <h2 id={`${id}-title`}>{mode === "login" ? "欢迎回来" : "创建你的账号"}</h2>
        <p>{mode === "login" ? "使用邮箱、电话或学生证号继续。" : "使用昵称保护身份，并创建你的社区账号。"}</p>
        <div aria-label="账号操作" className="auth-modal__tabs" role="tablist">
          <a aria-selected={mode === "login"} href="#sign-in" role="tab">登录 <small>Sign in</small></a>
          <a aria-selected={mode === "register"} href="#create-account" role="tab">创建账号 <small>Create account</small></a>
        </div>
        <AuthActionForm mode={mode} />
      </section>
    </div>
  );
}

export function SiteHeader({ user = null }: { user?: HeaderUser | null }) {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link aria-label="Bridge Forward 首页" className="brand" href="/">
            <span aria-hidden="true" className="brand-logo-crop" />
            <span className="brand__wordmark brand__wordmark--logo">BRIDGE <em>FORWARD</em></span>
          </Link>
          <div className="site-header__actions">
            <Link className="header-home-link" href="/">首页 <small>Home</small></Link>
            <LanguageControl />
            {user ? (
              <AccountMenu initial={user.initial} label={user.label} />
            ) : (
              <>
                <a className="header-auth-button header-auth-button--ghost" href="#sign-in">登录 <small>Sign in</small></a>
                <a className="header-auth-button header-auth-button--solid" href="#create-account">创建账号 <small>Create</small></a>
              </>
            )}
          </div>
        </div>
      </header>
      {!user && <AuthModal mode="login" />}
      {!user && <AuthModal mode="register" />}
    </>
  );
}

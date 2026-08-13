import Link from "next/link";

import { LanguageControl } from "@/components/language-control";
import { logoutAction, submitLoginAction, submitRegisterAction } from "@/features/auth/actions";

export type HeaderUser = {
  label: string;
};

function AuthModal({ mode }: { mode: "login" | "register" }) {
  const id = mode === "login" ? "sign-in" : "create-account";
  return (
    <div className="auth-modal auth-modal--target" id={id}>
      <section aria-labelledby={`${id}-title`} aria-modal="true" className="auth-modal__panel" role="dialog">
        <a aria-label="关闭账号窗口" className="auth-modal__close" href="#">×</a>
        <p className="auth-modal__eyebrow">BRIDGE FORWARD ACCOUNT</p>
        <h2 id={`${id}-title`}>{mode === "login" ? "欢迎回来" : "创建你的账号"}</h2>
        <p>{mode === "login" ? "使用学生证号、Gmail 或电话号码继续。" : "选择实名展示或使用社区昵称，保护你的个人身份。"}</p>
        <div className="auth-modal__tabs" role="tablist" aria-label="账号操作">
          <a aria-selected={mode === "login"} href="#sign-in" role="tab">登录 <small>Sign in</small></a>
          <a aria-selected={mode === "register"} href="#create-account" role="tab">创建账号 <small>Create account</small></a>
        </div>
        {mode === "login" ? (
          <form action={submitLoginAction} className="auth-modal__form">
            <label>登录方式 <small>Sign-in method</small>
              <select defaultValue="gmail" name="identifierType">
                <option value="gmail">Gmail / 邮箱</option>
                <option value="phone">电话号码 / Phone</option>
                <option value="student_id">学生证号 / Student ID</option>
              </select>
            </label>
            <label>账号 <small>Identifier</small><input name="identifier" required /></label>
            <label>密码 <small>Password</small><input name="password" required type="password" /></label>
            <button type="submit">登录 / Sign in</button>
          </form>
        ) : (
          <form action={submitRegisterAction} className="auth-modal__form auth-modal__form--register">
            <label>身份展示 <small>Identity</small>
              <select defaultValue="anonymous" name="identityMode">
                <option value="anonymous">不透露具体身份 / Private</option>
                <option value="real_name">实名展示 / Real name</option>
              </select>
            </label>
            <label>注册方式 <small>Account method</small>
              <select defaultValue="gmail" name="identifierType">
                <option value="gmail">Gmail / 邮箱</option>
                <option value="phone">电话号码 / Phone</option>
                <option value="student_id">学生证号 / Student ID</option>
              </select>
            </label>
            <label>账号 <small>Identifier</small><input name="identifier" required /></label>
            <label>密码 <small>Password</small><input name="password" required type="password" /></label>
            <label>姓名或社区昵称 <small>Name / Nickname</small><input maxLength={30} minLength={2} name="displayName" required /></label>
            <label>母语 <small>Native language</small><input defaultValue="中文" name="nativeLanguage" required /></label>
            <button type="submit">创建账号 / Create account</button>
          </form>
        )}
      </section>
    </div>
  );
}

export function SiteHeader({ user = null }: { user?: HeaderUser | null }) {
  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="brand" href="/" aria-label="Bridge Forward 首页">
            <span className="brand-logo-crop" aria-hidden="true" />
            <span className="brand__wordmark brand__wordmark--logo">BRIDGE <em>FORWARD</em></span>
          </Link>
          <div className="site-header__actions">
            <Link className="header-home-link" href="/">首页 <small>Home</small></Link>
            <LanguageControl />
            {user ? (
              <>
                <span className="header-auth-button header-user-name" title={user.label}>{user.label}</span>
                <form action={logoutAction} className="header-sign-out-form">
                  <button className="header-auth-button header-auth-button--solid" type="submit">退出登录 <small>Sign out</small></button>
                </form>
              </>
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

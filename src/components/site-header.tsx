import Link from "next/link";

import { AccountMenu } from "@/components/account-menu";
import { LanguageControl } from "@/components/language-control";

export type HeaderUser = { initial: string; label: string };

export function SiteHeader({ user = null }: { user?: HeaderUser | null }) {
  return (
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
              <Link className="header-auth-button header-auth-button--ghost" href="/sign-in">登录 <small>Sign in</small></Link>
              <Link className="header-auth-button header-auth-button--solid" href="/register">创建账号 <small>Create</small></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

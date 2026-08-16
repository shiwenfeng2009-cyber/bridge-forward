import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site-header";
import { LanguageProvider } from "@/lib/i18n/language-context";

function renderHeader(user?: { initial: string; label: string } | null) {
  render(<LanguageProvider><SiteHeader user={user} /></LanguageProvider>);
}

describe("SiteHeader authentication state", () => {
  it("shows authentication actions and modals to signed-out visitors", () => {
    renderHeader(null);
    expect(screen.getByRole("link", { name: "登录 Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "创建账号 Create" })).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "没收到确认邮件？重新发送 / Resend confirmation" })).toBeInTheDocument();
  });

  it("guides confirmed email users back to sign in", () => {
    window.history.replaceState({}, "", "/?auth=confirmed#sign-in");
    renderHeader(null);
    expect(screen.getByText("邮箱已确认，请登录。Email confirmed—please sign in.")).toBeInTheDocument();
    window.history.replaceState({}, "", "/");
  });

  it("shows the authenticated account menu and hides guest controls", () => {
    renderHeader({ initial: "I", label: "IslandBridge" });
    expect(screen.queryByRole("link", { name: "登录 Sign in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "创建账号 Create" })).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /IslandBridge/ }));
    expect(screen.getByRole("menu", { name: "账户菜单 / Account menu" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "个人资料 Profile" })).toHaveAttribute("href", "/account");
    expect(screen.getByRole("menuitem", { name: "我的发布 My posts" })).toHaveAttribute("href", "/account/posts");
    expect(screen.getByRole("menuitem", { name: "设置 Settings" })).toHaveAttribute("href", "/account#settings");
    expect(screen.getByRole("menuitem", { name: "退出登录 Sign out" })).toHaveAttribute("type", "submit");
  });
});

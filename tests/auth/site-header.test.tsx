import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site-header";
import { LanguageProvider } from "@/lib/i18n/language-context";

function renderHeader(user?: { initial: string; label: string } | null) {
  render(<LanguageProvider><SiteHeader user={user} /></LanguageProvider>);
}

describe("SiteHeader authentication state", () => {
  it("shows authentication links without embedding credential forms in public pages", () => {
    renderHeader(null);
    expect(screen.getByRole("link", { name: "登录 Sign in" })).toHaveAttribute("href", "/sign-in");
    expect(screen.getByRole("link", { name: "创建账号 Create" })).toHaveAttribute("href", "/register");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
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

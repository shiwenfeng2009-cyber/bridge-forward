import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/site-header";
import { LanguageProvider } from "@/lib/i18n/language-context";

function renderHeader(user?: { label: string } | null) {
  render(
    <LanguageProvider>
      <SiteHeader user={user} />
    </LanguageProvider>,
  );
}

describe("SiteHeader authentication state", () => {
  it("shows sign-in and registration actions to signed-out visitors", () => {
    renderHeader(null);

    expect(screen.getByRole("link", { name: "登录 Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "创建账号 Create" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "退出登录 Sign out" })).not.toBeInTheDocument();
  });

  it("shows the user label and sign-out action to authenticated users", () => {
    renderHeader({ label: "IslandBridge" });

    expect(screen.getByText("IslandBridge")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "退出登录 Sign out" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "登录 Sign in" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "创建账号 Create" })).not.toBeInTheDocument();
  });
});

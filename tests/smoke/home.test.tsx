import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "@/app/page";
import { SiteHeader } from "@/components/site-header";
import { LanguageProvider } from "@/lib/i18n/language-context";

function renderHome() {
  render(
    <LanguageProvider>
      <SiteHeader />
      <Home />
    </LanguageProvider>,
  );
}

describe("Home", () => {
  it("uses the campus-map homepage message", () => {
    renderHome();

    expect(
      screen.getByRole("heading", {
        name: "为刚来到美国的学生撑一把伞",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/A warm place to help newly arrived students/)).toBeInTheDocument();
    expect(screen.getByText(/我需要帮助/)).toBeInTheDocument();
  });

  it("keeps the top navigation readable without overlapping bilingual labels", () => {
    renderHome();

    const nav = screen.getByRole("navigation", { name: "Primary navigation" });

    expect(screen.getByRole("link", { name: "Bridge Forward home" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "开始 / Start Here" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "互助问答 / Ask & Connect" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "心理支持 / Mental Wellness" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "故事 / Stories" })).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "资源 / Resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "登录 / Sign in" })).toBeInTheDocument();
  });

  it("keeps three practical homepage entry cards", () => {
    renderHome();

    expect(screen.getByRole("heading", { name: "三大实用入口，陪你安心前行" })).toBeInTheDocument();
    const categoryHeadings = screen.getAllByRole("heading", { level: 3 }).map((node) => node.textContent);
    expect(categoryHeadings.slice(0, 3)).toEqual(["新生清单", "私人心情角落", "匿名提问"]);

    expect(screen.getByText(/Bridge Forward is peer support/)).toBeInTheDocument();
    expect(screen.queryByText("I feel lonely at lunch. What should I do?")).not.toBeInTheDocument();
    expect(screen.queryByText("How do I email my teacher?")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AskPage from "@/app/ask/page";
import SchoolInformationPage from "@/app/school-information/page";
import SearchPage from "@/app/search/page";
import { LanguageProvider } from "@/lib/i18n/language-context";

function renderWithLanguage(ui: React.ReactNode) {
  render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("core section pages", () => {
  it("shows Ask as a playful moderated hub for forum, stories, and journal", () => {
    renderWithLanguage(<AskPage />);

    expect(
      screen.getByRole("heading", { name: "问题、故事和心情，都可以有一个出口" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ask like a group chat" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Browse student stories" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Check in with yourself" })).toBeInTheDocument();
    expect(screen.getByText(/第一版会继续审核问题、故事和新用户前几条回复/)).toBeInTheDocument();
  });

  it("shows School Information as the priority categorized student guide", async () => {
    renderWithLanguage(await SchoolInformationPage());

    expect(
      screen.getByRole("heading", { name: "先看懂学校规则，迷茫会少很多" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "先分类，再看具体信息" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /U.S. High School Basics/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Moanalua Schedule/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Map & Getting Around/ })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Rules & Daily Life/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "先完成这 6 件小事" })).toBeInTheDocument();
    expect(screen.getByText(/Moanalua-specific information is linked to official school pages/)).toBeInTheDocument();
  });

  it("shows Search as an interactive search entry for Ask and school information", () => {
    renderWithLanguage(<SearchPage />);

    expect(screen.getByRole("heading", { name: "搜索你现在最需要知道的事" })).toBeInTheDocument();
    expect(
      screen.getByRole("searchbox", {
        name: "搜索 Ask、故事或学校信息 / Search Ask, stories, or school information",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "map" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "schedule" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Moanalua Campus Map/ })).toBeInTheDocument();
  });
});

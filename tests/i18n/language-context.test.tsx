import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { BilingualText } from "@/components/bilingual-text";
import { LanguageControl } from "@/components/language-control";
import {
  LanguageProvider,
  useLanguage,
} from "@/lib/i18n/language-context";

function LanguageExample() {
  const { mode } = useLanguage();

  return (
    <>
      <LanguageControl />
      <BilingualText mode={mode} zh="你好" en="Hello" />
    </>
  );
}

describe("LanguageProvider", () => {
  it("starts in bilingual mode", () => {
    render(
      <LanguageProvider>
        <LanguageExample />
      </LanguageProvider>,
    );

    expect(screen.getByText("你好")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "双语" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows only English after selecting English", async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageExample />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(screen.queryByText("你好")).not.toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("shows only Chinese after selecting Chinese", async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageExample />
      </LanguageProvider>,
    );

    await user.click(screen.getByRole("button", { name: "中文" }));

    expect(screen.getByText("你好")).toBeInTheDocument();
    expect(screen.queryByText("Hello")).not.toBeInTheDocument();
  });
});

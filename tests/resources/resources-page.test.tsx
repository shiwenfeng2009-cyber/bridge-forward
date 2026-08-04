import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ResourcesPage from "@/app/resources/page";

describe("Resources page", () => {
  it("shows calm help routes and peer-support limits", () => {
    render(<ResourcesPage />);

    expect(screen.getByRole("heading", { name: "需要帮助时，可以从这里开始" })).toBeInTheDocument();
    expect(screen.getByText(/Bridge Forward 提供 peer support/)).toBeInTheDocument();
    expect(screen.getByText(/does not provide diagnosis or treatment/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trusted adult" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "School counselor or staff" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "988 Suicide & Crisis Lifeline" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Immediate danger" })).toBeInTheDocument();
  });

  it("does not claim emergency monitoring or therapy", () => {
    render(<ResourcesPage />);

    expect(screen.queryByText(/24\/7 monitoring by Bridge Forward/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/therapy service/i)).not.toBeInTheDocument();
  });
});

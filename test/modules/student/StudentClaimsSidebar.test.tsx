import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { StudentClaimsSidebar } from "@/modules/student/support/components/StudentClaimsSidebar";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

describe("StudentClaimsSidebar — antes de reclamar", () => {
  beforeEach(() => {
    navigateMock.mockReset();
  });

  it("navega a las clases no confirmadas del historial", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <StudentClaimsSidebar openCount={0} inReviewCount={0} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Ir a clases no confirmadas" }));

    expect(navigateMock).toHaveBeenCalledWith("/student/classes?category=NOT_CONFIRMED");
  });
});

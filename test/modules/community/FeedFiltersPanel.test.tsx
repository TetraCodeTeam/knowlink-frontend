import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedFiltersPanel from "@/modules/community/components/FeedFiltersPanel";
import { useCommunityCareers } from "@/modules/community/hooks/useCommunityCareers";
import type { FeedFilters } from "@/modules/community/interfaces/feed-filters.interface";

vi.mock("@/modules/community/hooks/useCommunityCareers", () => ({
  useCommunityCareers: vi.fn(() => ({
    data: [{ careerId: "career-vet", name: "Medicina Veterinaria" }],
    isLoading: false,
  })),
}));

vi.mock("@/modules/community/hooks/useCommunitySubjects", () => ({
  useCommunitySubjects: () => ({ subjects: [], isLoading: false }),
}));

const filters: FeedFilters = {
  type: null,
  period: "ALL",
  careerId: null,
  subjectIds: [],
  status: null,
};

function renderPanel() {
  render(
    <FeedFiltersPanel
      filters={filters}
      counts={null}
      activeCount={0}
      onTypeChange={vi.fn()}
      onApply={vi.fn()}
      onClear={vi.fn()}
    />
  );
}

describe("FeedFiltersPanel", () => {
  it("usa las carreras de la comunidad acotadas a la institución del usuario", async () => {
    const user = userEvent.setup();
    renderPanel();

    expect(vi.mocked(useCommunityCareers)).toHaveBeenCalled();

    await user.click(screen.getByRole("combobox", { name: "Carrera universitaria" }));

    expect(await screen.findByRole("option", { name: "Medicina Veterinaria" })).toBeInTheDocument();
  });
});

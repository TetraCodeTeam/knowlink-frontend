import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { highlightMatch } from "./highlight-match";

describe("highlightMatch", () => {
  it("wraps the first case-insensitive match in <strong>", () => {
    const { container } = render(<>{highlightMatch("Ana García", "ana")}</>);
    expect(container.querySelector("strong")).toHaveTextContent("Ana");
  });

  it("returns plain text when there is no match", () => {
    const { container } = render(<>{highlightMatch("Ana García", "zzz")}</>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container).toHaveTextContent("Ana García");
  });

  it("returns plain text when query is empty or blank", () => {
    const { container } = render(<>{highlightMatch("Ana García", "")}</>);
    expect(container.querySelector("strong")).toBeNull();
    expect(container).toHaveTextContent("Ana García");
  });

  it("wraps only the first occurrence when repeated", () => {
    const { container } = render(<>{highlightMatch("Ana Ana", "ana")}</>);
    const strongs = container.querySelectorAll("strong");
    expect(strongs).toHaveLength(1);
    expect(strongs[0]).toHaveTextContent("Ana");
  });
});

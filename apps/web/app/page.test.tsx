import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Home from "./page";

describe("Home page", () => {
  it("renders the turborepo logo", () => {
    render(<Home />);
    const logos = screen.getAllByAltText("Turborepo logo");
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveClass("imgLight");
    expect(logos[1]).toHaveClass("imgDark");
  });
});

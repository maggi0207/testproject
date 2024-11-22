import React from "react";
import { render, screen } from "@testing-library/react";
import PageLoader from "./PageLoader";

jest.mock("@wf-wfria/pioneer-core", () => ({
  Flexgrid: ({ children }) => <div>{children}</div>,
  FlexgridItem: ({ children }) => <div>{children}</div>,
  ProgressSpinner: () => <div data-testid="progress-spinner">Mocked Spinner</div>,
}));

describe("PageLoader Component", () => {
  it("should render Flexgrid with three FlexgridItem components", () => {
    render(<PageLoader />);
    expect(screen.getAllByText(/Mocked Spinner|^$/).length).toBe(3);
  });

  it("should render the mocked ProgressSpinner inside the third FlexgridItem", () => {
    render(<PageLoader />);
    expect(screen.getByTestId("progress-spinner")).toBeInTheDocument();
  });
});

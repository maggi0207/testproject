import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import Payments from "./Payments";

const mockStore = configureStore([]);
const initialState = {
  paymentDataset: {
    data: {
      items: [
        {
          id: "1",
          name: "Dataset 1",
          sourceSystem: "System A",
          harvestedDate: "2024-11-20T12:00:00Z",
          paymentsCount: 100,
          activeRunId: "Run123",
        },
      ],
      totalItems: 1,
    },
    error: null,
    loading: false,
    createNewDatasetStatus: null,
  },
};

describe("Payments Component", () => {
  let store;

  beforeEach(() => {
    store = mockStore(initialState);
    store.dispatch = jest.fn();
  });

  it("renders table with data", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    expect(screen.getByText("Payment Datasets")).toBeInTheDocument();
    expect(screen.getByText("Dataset 1")).toBeInTheDocument();
    expect(screen.getByText("System A")).toBeInTheDocument();
    expect(screen.getByText("No. of Payments")).toBeInTheDocument();
  });

  it("shows error feedback when there is an error", () => {
    store = mockStore({
      ...initialState,
      paymentDataset: { ...initialState.paymentDataset, error: "Failed to fetch data" },
    });

    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    expect(screen.getByText("Failed to fetch data")).toBeInTheDocument();
  });

  it("handles Create Payment Dataset button click", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    const createButton = screen.getByRole("button", { name: /create payment dataset/i });
    fireEvent.click(createButton);

    expect(screen.getByText("Add Payment Dataset")).toBeInTheDocument();
  });

  it("handles Actions menu interaction", async () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    const actionsMenu = screen.getByRole("menu", { name: /actions/i });
    fireEvent.click(actionsMenu);

    const scheduleRunOption = screen.getByRole("menuitem", { name: /schedule a run/i });
    fireEvent.click(scheduleRunOption);

    await waitFor(() => {
      expect(screen.getByText("Initiate Run")).toBeInTheDocument();
    });
  });

  it("handles pagination changes", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    const nextPageButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextPageButton);

    expect(store.dispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it("updates search query", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    const searchInput = screen.getByLabelText(/search datasets/i);
    fireEvent.change(searchInput, { target: { value: "Dataset 1" } });

    expect(searchInput).toHaveValue("Dataset 1");
  });
});

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import Payments from "./Payments";
import paymentDatasetReducer from "../../reducers/paymentdataset.reducer";

describe("Payments Component with Reducer", () => {
  let store;

  beforeEach(() => {
    // Create a real Redux store with the actual reducer
    store = configureStore({
      reducer: {
        paymentDatasetState: paymentDatasetReducer,
      },
      preloadedState: {
        paymentDatasetState: {
          data: {
            items: [
              {
                id: "1",
                name: "Dataset 1",
                sourceSystem: "System A",
                harvestedDate: "2023-12-01T12:00:00Z",
                paymentsCount: 10,
                activeRunId: "RUN123",
              },
            ],
            totalItems: 1,
          },
          error: null,
          loading: false,
          createNewDatasetStatus: null,
        },
      },
    });
  });

  it("renders Payment Datasets table", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    expect(screen.getByText("Payment Datasets")).toBeInTheDocument();
    expect(screen.getByText("Dataset 1")).toBeInTheDocument();
    expect(screen.getByText("System A")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("handles Create Payment Dataset button click", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    const createButton = screen.getByText("Create Payment Dataset");
    fireEvent.click(createButton);

    expect(screen.getByText("Add Payment Dataset")).toBeInTheDocument();
  });

  it("handles Search Datasets input", () => {
    render(
      <Provider store={store}>
        <Payments />
      </Provider>
    );

    const searchInput = screen.getByLabelText("Search Datasets");
    fireEvent.change(searchInput, { target: { value: "Dataset" } });

    expect(searchInput.value).toBe("Dataset");
  });
});

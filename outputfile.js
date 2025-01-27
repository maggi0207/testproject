import React from "react";
import { render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PollingComponent from "./PollingComponent";
import paymentDatasetReducer from "../../reducers/paymentdataset.reducer";
import { getPaymentDatasetAPI } from "../../service/paymentdataset.service";

jest.mock("../../service/paymentdataset.service", () => ({
  getPaymentDatasetAPI: jest.fn(),
}));

let store;

describe("PollingComponent with Redux Toolkit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store = configureStore({
      reducer: {
        paymentDatasetState: paymentDatasetReducer,
      },
      preloadedState: {
        paymentDatasetState: {
          items: [{ id: 1, status: "PENDING" }],
        },
      },
    });
  });

  it("should poll the API and update the dataset", async () => {
    getPaymentDatasetAPI.mockResolvedValueOnce({
      id: 1,
      status: "COMPLETED",
    });

    render(
      <Provider store={store}>
        <PollingComponent paymentDataset={{ id: 1, status: "PENDING" }} WAIT_FOR={100} />
      </Provider>
    );

    await waitFor(() => {
      expect(getPaymentDatasetAPI).toHaveBeenCalledWith(1);
    });

    const actions = store.getState().paymentDatasetState.items;
    expect(actions).toEqual([
      {
        id: 1,
        status: "COMPLETED",
      },
    ]);
  });

  it("should stop polling when the status is COMPLETED", async () => {
    render(
      <Provider store={store}>
        <PollingComponent paymentDataset={{ id: 1, status: "COMPLETED" }} WAIT_FOR={100} />
      </Provider>
    );

    await waitFor(() => {
      expect(getPaymentDatasetAPI).not.toHaveBeenCalled();
    });
  });

  it("should handle API errors gracefully", async () => {
    getPaymentDatasetAPI.mockRejectedValueOnce(new Error("API error"));

    render(
      <Provider store={store}>
        <PollingComponent paymentDataset={{ id: 1, status: "PENDING" }} WAIT_FOR={100} />
      </Provider>
    );

    await waitFor(() => {
      expect(getPaymentDatasetAPI).toHaveBeenCalledWith(1);
    });

    const actions = store.getState().paymentDatasetState.items;
    expect(actions).toEqual([{ id: 1, status: "PENDING" }]);
  });
});

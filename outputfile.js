import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import PollingComponent from "./PollingComponent";
import { getPaymentDatasetAPI } from "../../service/paymentdataset.service";

jest.mock("../../service/paymentdataset.service", () => ({
  getPaymentDatasetAPI: jest.fn(),
}));

const mockStore = configureStore([]);
let store;

describe("PollingComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore({
      paymentDatasetState: {
        items: [{ id: 1, status: "PENDING" }],
      },
    });
  });

  it("should poll the API and update the dataset", async () => {
    const mockPaymentDataset = {
      id: 1,
      status: "PENDING",
    };

    getPaymentDatasetAPI.mockResolvedValueOnce({
      id: 1,
      status: "COMPLETED",
    });

    render(
      <Provider store={store}>
        <PollingComponent paymentDataset={mockPaymentDataset} WAIT_FOR={100} />
      </Provider>
    );

    await waitFor(() => {
      expect(getPaymentDatasetAPI).toHaveBeenCalledWith(1);
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({
        type: "UPDATE_PENDING_DATASET",
        payload: expect.objectContaining({
          items: [
            {
              id: 1,
              status: "COMPLETED",
            },
          ],
        }),
      })
    );
  });

  it("should stop polling when the status is COMPLETED", async () => {
    const mockPaymentDataset = {
      id: 1,
      status: "COMPLETED",
    };

    render(
      <Provider store={store}>
        <PollingComponent paymentDataset={mockPaymentDataset} WAIT_FOR={100} />
      </Provider>
    );

    await waitFor(() => {
      expect(getPaymentDatasetAPI).not.toHaveBeenCalled();
    });
  });

  it("should handle API errors gracefully", async () => {
    const mockPaymentDataset = {
      id: 1,
      status: "PENDING",
    };

    getPaymentDatasetAPI.mockRejectedValueOnce(new Error("API error"));

    render(
      <Provider store={store}>
        <PollingComponent paymentDataset={mockPaymentDataset} WAIT_FOR={100} />
      </Provider>
    );

    await waitFor(() => {
      expect(getPaymentDatasetAPI).toHaveBeenCalledWith(1);
    });

    const actions = store.getActions();
    expect(actions).toHaveLength(0);
  });
});

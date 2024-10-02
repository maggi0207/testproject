import React from "react";
import '@testing-library/jest-dom';
import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import App from "../App";
import { app_mock } from './mock';
import { render } from "../../common/tests/helper";
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import * as apiService from '../services/api.service';
import { fetchComparisonReportSuccess, handleInterRunAPIError } from '../redux/actions/AppActions';

jest.mock('../services/api.service');

const mockStore = configureStore([]);
let store;

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

describe("App component with mocked store and API", () => {

  beforeEach(() => {
    store = mockStore({
      AppReducer: {
        reportData: null,
        isReportLoading: true,
        isAPIError: false,
      }
    });
  });

  test("loads component and API call succeeds", async () => {
    apiService.fetchComparisonReportData.mockResolvedValue({
      status: 200,
      data: app_mock,
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await apiService.fetchComparisonReportData();
    });

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(6);

    fireEvent.click(tabs[0]);
    fireEvent.click(tabs[1]);
    fireEvent.click(tabs[2]);
    fireEvent.click(tabs[3]);
    fireEvent.click(tabs[4]);
    fireEvent.click(tabs[5]);

    expect(screen.getByText('Transactions by Phase')).toBeInTheDocument();
    expect(screen.getByText('AV Transactions')).toBeInTheDocument();
  });

  test("handles API error", async () => {
    apiService.fetchComparisonReportData.mockRejectedValue({
      response: { data: 'Error fetching report data' }
    });

    await act(async () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await act(async () => {
      await apiService.fetchComparisonReportData();
    });

    expect(screen.getByText('Error while connecting to Back-End server. Server might be down. Please try again after some time')).toBeInTheDocument();
  });
});

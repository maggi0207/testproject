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
 presets: ["@babel/preset-env", "@babel/preset-react"],
jest.mock('../services/api.service');

const mockStore = configureStore([]);
let store;

afterEach(() => {
    cleanup();
    jest.clearAllMocks();
});

// Mock components with delays
jest.mock('./components/STPTranscationsChart', () => {
  return jest.fn(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(() => <div>STP Transcations Chart</div>);
      }, 1000); // Simulate a delay of 1 second
    });
  });
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




test('should add and trigger beforeunload and unload event listeners', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const beforeUnloadHandler = jest.fn();
    const unloadHandler = jest.fn();

    // Mock implementation of the event listeners
    window.addEventListener = jest.fn((event, cb) => {
      if (event === 'beforeunload') {
        beforeUnloadHandler.mockImplementation(cb);
      } else if (event === 'unload') {
        unloadHandler.mockImplementation(cb);
      }
    });

    // Render the component
    renderWithProvider(<ThemeProvider><App /></ThemeProvider>, {
      initialState: { AppReducer: { reportData: {} } }
    });

    // Assert that event listeners were added
    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('unload', expect.any(Function));

    // Trigger the beforeunload and unload events manually
    fireEvent(window, new Event('beforeunload'));
    fireEvent(window, new Event('unload'));

    // Check if the mock handlers were called
    expect(beforeUnloadHandler).toHaveBeenCalled();
    expect(unloadHandler).toHaveBeenCalled();

    // Unmount the component and check if event listeners are removed
    cleanup();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('unload', expect.any(Function));
  });

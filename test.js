import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import AVStatsChart from '../../src/App/components/AVStatsChart';
import TransactionsChart from '../../src/App/components/TransactionsChart';
import reportData from '../mocks/reportData.json';
import { ThemeProvider } from "@wf-wfria/pioneer-core";

const mockStore = configureStore([]);

const renderWithProviders = (component, { store } = {}) => {
  return render(
    <Provider store={store}>
      <ThemeProvider>
        {component}
      </ThemeProvider>
    </Provider>
  );
};

describe('AVStatsChart Component', () => {
  let store;
  let renderedComponent;

  beforeEach(() => {
    store = mockStore({});
    renderedComponent = renderWithProviders(<AVStatsChart reportData={reportData} />, { store });
  });

  it('renders correctly with report data passed as props', async () => {
    const { getByText, debug } = renderedComponent;

    debug();  // This will print the entire rendered DOM at this point

    // Verify the title is rendered
    await waitFor(() => {
      expect(getByText('Status of Transactions at Account Validation')).toBeInTheDocument();
    });

    // Use the debug method to log again after DOM update
    debug();  // This will print the DOM after the content has been rendered

    // Verify a specific transaction type is rendered
    expect(getByText('Valid Transactions')).toBeInTheDocument();
  });
});

describe('TransactionsChart Component', () => {
  let store;
  let renderedComponent;

  beforeEach(() => {
    store = mockStore({});
    renderedComponent = renderWithProviders(<TransactionsChart reportData={reportData} />, { store });
  });

  it('renders the donut chart correctly with report data passed as props', async () => {
    const { getByText, getByRole, debug } = renderedComponent;

    debug();  // Prints the current DOM

    // Verify the chart title is rendered
    await waitFor(() => {
      expect(getByText('Transactions Overview')).toBeInTheDocument();
    });

    debug();  // Prints the updated DOM

    // Verify DonutChart or its related elements are rendered (assuming it's an SVG or a chart element)
    expect(getByRole('img')).toBeInTheDocument();  // Adjust based on the actual rendered role or tag
  });
});

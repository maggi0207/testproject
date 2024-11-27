import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DeviceGridwall from './index';
import Emitter from 'onevzsoemfeframework/Emitter';

jest.mock('onevzsoemfeframework/RemoteLoader', () => jest.fn(() => <div data-testid="RemoteLoader">RemoteLoader</div>));
jest.mock('../../modules/errorHandling/FederatedWrapper', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('@vds/notifications', () => ({
  Notification: jest.fn(() => <div data-testid="Notification">Notification</div>),
}));

let mockQueryParamValue = null;

jest.mock('onevzsoemfecommon/Helpers', () => ({
  __esModule: true,
  ...jest.requireActual('onevzsoemfecommon/Helpers'),
  getQueryParamByName: (value) => {
    if (value === 'defaultTab') {
      return mockQueryParamValue;
    }
    return null;
  },
}));

describe('DeviceGridwall Component', () => {
  const defaultProps = {
    moduleProps: {},
    acssThemeProps: {
      background: '#ffffff',
    },
    transformedValidateDeviceSimIdData: {},
  };

  const appConfigMock = {
    messages: {
      mfe_down_title: 'MFE Down',
      mfe_down_subtitle: 'Please try again later.',
    },
  };

  jest.mock('onevzsoemfeframework/GetAppConfig', () => ({
    GetAppConfig: jest.fn(() => appConfigMock),
  }));

  beforeEach(() => {
    mockQueryParamValue = null;
    window.mfe = {};
    jest.spyOn(Emitter, 'emit').mockClear(); // Clear previous spy calls
  });

  it('renders DeviceGridwall with RemoteLoader and Notification components', () => {
    render(<DeviceGridwall {...defaultProps} />);
    expect(screen.getAllByTestId('flex-left-rail-section')[0]).toBeInTheDocument();
    expect(screen.getByTestId('flex-review-plans-section')).toBeInTheDocument();
  });

  it('applies the correct background color when window.mfe.csMfeFlow is true', () => {
    window.mfe.csMfeFlow = true;

    const customProps = {
      ...defaultProps,
      acssThemeProps: {
        background: '#123456',
      },
    };

    render(<DeviceGridwall {...customProps} />);

    const tabContainer = screen.getByTestId('flex-review-plans-section').parentElement;
    expect(tabContainer).toHaveStyle('background-color: #123456');
  });

  it('renders DeviceGridwall with specific query parameter logic for "defaultTab"', () => {
    mockQueryParamValue = 'APDP';

    render(<DeviceGridwall {...defaultProps} />);
    expect(screen.getAllByTestId('flex-left-rail-section')[0]).toBeInTheDocument();
  });

  it('calls Emitter.emit when the first tab is clicked', () => {
    window.mfe.scmUpgradeMfeEnable = true;

    render(<DeviceGridwall {...defaultProps} />);

    const deviceTab = screen.getByText('Devices');
    const accessoryTab = screen.getByText('AccessorySCM');

    // Verify tabs are present
    expect(deviceTab).toBeInTheDocument();
    expect(accessoryTab).toBeInTheDocument();

    // Click the first tab
    fireEvent.click(deviceTab);

    // Assert Emitter.emit was called
    expect(Emitter.emit).toHaveBeenCalledWith('ACSS_SCM_DEVICE_SUBTAB', true);
  });
});

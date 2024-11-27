import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { getQueryParamByName } from 'onevzsoemfecommon/Helpers';
import DeviceGridwall from './index';






jest.mock('onevzsoemfeframework/RemoteLoader', () => jest.fn(() => <div data-testid='RemoteLoader'>RemoteLoader</div>));
jest.mock('../../modules/errorHandling/FederatedWrapper', () => jest.fn(({ children }) => <div>{children}</div>));
jest.mock('@vds/notifications', () => ({
  Notification: jest.fn(() => <div data-testid='Notification'>Notification</div>),
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
    // Reset window.mfe and mocks before each test
    window.mfe = {};
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

  it('applies no background color when window.mfe.csMfeFlow is false', () => {
    window.mfe.csMfeFlow = false;

    const customProps = {
      ...defaultProps,
      acssThemeProps: {
        background: '#123456',
      },
    };

    render(<DeviceGridwall {...customProps} />);

    const tabContainer = screen.getByTestId('flex-review-plans-section').parentElement;
    expect(tabContainer).toHaveStyle('background-color: ');
  });

  it('applies no background color when acssThemeProps.background is not provided', () => {
    window.mfe.csMfeFlow = true;

    const customProps = {
      ...defaultProps,
      acssThemeProps: {
        background: '',
      },
    };

    render(<DeviceGridwall {...customProps} />);

    const tabContainer = screen.getByTestId('flex-review-plans-section').parentElement;
    expect(tabContainer).toHaveStyle('background-color: ');
  });
});

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
    jest.mock(
      'onevzsoemfecommon/Helpers',
      () => ({
        __esModule: true,
        ...jest.requireActual('onevzsoemfecommon/Helpers'),
        getQueryParamByName: (value) => {
          if (value === 'defaultTab') {
            return 'APDP';
          }
          // if (value === 'activeMtn') {
          //   return 'newLine1';
          // }
          return null;
        },
      }),
      { virtual: true },
    );
    // Reset window.mfe and mocks before each test
    window.mfe = { scmUpgradeMfeEnable: true };
  });

  it('renders DeviceGridwall with RemoteLoader and Notification components', () => {
    render(<DeviceGridwall {...defaultProps} />);

    expect(screen.getAllByTestId('flex-left-rail-section')[0]).toBeInTheDocument();
  });


});



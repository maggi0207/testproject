import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailDeliveryPreferences from './EmailDeliveryPreferences'; // Adjust the import path
import { useDispatch, useSelector } from 'react-redux';
import getEmailDeliveryPreferences from '../../../../Services/getEmailDeliveryPreferences'; // Adjust the import path
import { loadingIndicatorActions } from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';
import { dataLayerAccountNotifications } from '../../../../utils/analyticsUtils';
import { updateEmailPreferenceToggle, setEmailPreferencesInitialValues } from '../../../../store/CommunicationNotification/EmailPreferenceSlice';

// Mock the Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Preserve other functionalities
  NavLink: ({ children, to, ...props }) => (
    <div data-testid="navlink-mock" {...props}>
      MockNavLink to: {to}
      {children}
    </div>
  ),
}));

// Mock the API service
jest.mock('../../../../Services/getEmailDeliveryPreferences');

// Mock the analytics utility
jest.mock('../../../../utils/analyticsUtils', () => ({
  dataLayerAccountNotifications: jest.fn(),
}));

describe('EmailDeliveryPreferences', () => {
  let mockDispatch;
  let mockPreferences;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    
    mockPreferences = {
      dailySummary: false,
      instantNotification: true,
      pendingActionNotification: false,
    };

    useSelector.mockReturnValue({ emailPreferences: { current: mockPreferences } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render the component with the correct title and description', () => {
    const props = {
      title: 'Email Preferences',
      description: 'Configure your email preferences.',
      primarySubTitle: 'Daily Summary',
      primarySubDescription: 'Receive daily summaries of your activities.',
      secondarySubTitle: 'Instant Notification',
      secondarySubDescription: 'Get instant notifications when actions are required.',
      checkboxDescription: 'Enable pending action notifications.',
    };

    render(<EmailDeliveryPreferences {...props} />);

    expect(screen.getByText('Email Preferences')).toBeTruthy();
    expect(screen.getByText('Configure your email preferences.')).toBeTruthy();
    expect(screen.getByText('Daily Summary')).toBeTruthy();
    expect(screen.getByText('Instant Notification')).toBeTruthy();
  });

  test('should dispatch setEmailPreferencesInitialValues when API call returns preferences', async () => {
    getEmailDeliveryPreferences.mockResolvedValue({
      records: [{ Case_Email_Delivery_Preference__c: 'Digest Only' }],
    });

    render(<EmailDeliveryPreferences {...mockPreferences} />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setEmailPreferencesInitialValues({
          dailySummary: true,
          instantNotification: false,
          pendingActionNotification: false,
        })
      );
    });
  });

  test('should handle toggle for dailySummary', () => {
    render(<EmailDeliveryPreferences {...mockPreferences} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: /off/i });
    fireEvent.click(toggleSwitch); // Simulate toggling

    expect(mockDispatch).toHaveBeenCalledWith(updateEmailPreferenceToggle({
      key: 'dailySummary',
      value: true,
    }));

    expect(dataLayerAccountNotifications).toHaveBeenCalledWith('daily summary off to on');
    expect(dataLayerAccountNotifications).toHaveBeenCalledWith('instant on to off');
  });

  test('should handle toggle for instantNotification', () => {
    render(<EmailDeliveryPreferences {...mockPreferences} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: /off/i });
    fireEvent.click(toggleSwitch); // Simulate toggling

    expect(mockDispatch).toHaveBeenCalledWith(updateEmailPreferenceToggle({
      key: 'instantNotification',
      value: true,
    }));

    expect(dataLayerAccountNotifications).toHaveBeenCalledWith('instant off to on');
    expect(dataLayerAccountNotifications).toHaveBeenCalledWith('daily summary on to off');
  });

  test('should disable pendingActionNotification when dailySummary is off', () => {
    render(<EmailDeliveryPreferences {...mockPreferences} />);

    const checkbox = screen.getByLabelText('Enable pending action notifications.');
    expect(checkbox).toBeDisabled();
  });

  test('should dispatch loading indicator actions during API call', async () => {
    getEmailDeliveryPreferences.mockResolvedValue({
      records: [{ Case_Email_Delivery_Preference__c: 'Normal' }],
    });

    render(<EmailDeliveryPreferences {...mockPreferences} />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));
      expect(mockDispatch).toHaveBeenCalledWith(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
    });
  });
});

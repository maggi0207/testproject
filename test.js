import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutInspicio } from './CheckoutInspicio';

describe('CheckoutInspicio component', () => {
  const defaultProps = {
    cart: {
      lineDetails: {
        lineInfo: [
          {
            lineActivityType: 'NSE',
            serviceInfo: {
              primaryUserInfo: {}
            }
          }
        ]
      }
    },
    pageName: 'test-page',
    toggleInspicio: jest.fn(),
    channel: 'test-channel',
    channelDisplayFlags: {},
    orderBalance: 0,
    signatureInspicioFlag: true,
    signatureSendSmsContent: 'Send SMS',
    signatureSendEmailContent: 'Send Email',
    signatureActiveTextLabel: 'Inspicio mode',
    selectedCheckboxValue: true,
    selectedMtnValue: '1234567890',
    selectedEmail: 'test@example.com',
    cBandQualified: true,
    inspicioCustomSelectedMTN: '1234567890',
    techCoachRep: false,
    agreementEligibleFlags: {},
    orderPaymentDetails: {},
    customerProfileData: {},
    cancelLongPoll: false
  };

  it('renders correctly', () => {
    const { getByText } = render(<CheckoutInspicio {...defaultProps} />);
    expect(getByText('Send SMS')).toBeInTheDocument();
    expect(getByText('Send Email')).toBeInTheDocument();
    expect(getByText('Inspicio mode')).toBeInTheDocument();
  });

  it('handles radio button change', () => {
    const { getByLabelText } = render(<CheckoutInspicio {...defaultProps} />);
    const radioButton = getByLabelText('Send SMS');
    fireEvent.click(radioButton);
    expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
  });

  it('handles dropdown select change', () => {
    const { getByText } = render(<CheckoutInspicio {...defaultProps} />);
    const dropdownSelect = getByText('1234567890');
    fireEvent.click(dropdownSelect);
    expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
  });

  it('handles email input change', () => {
    const { getByPlaceholderText } = render(<CheckoutInspicio {...defaultProps} />);
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'new-email@example.com' } });
    expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
  });

  it('handles switch toggle', () => {
    const { getByRole } = render(<CheckoutInspicio {...defaultProps} />);
    const switchToggle = getByRole('switch');
    fireEvent.click(switchToggle);
    expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
  });

  it('renders ReceivePoll component', () => {
    const { getByText } = render(<CheckoutInspicio {...defaultProps} />);
    expect(getByText('Receive Poll')).toBeInTheDocument();
  });

  it('calls handleReceivePollApi function', async () => {
    const handleReceivePollApi = jest.fn();
    const { getByText } = render(<CheckoutInspicio {...defaultProps} handleReceivePollApi={handleReceivePollApi} />);
    const receivePoll = getByText('Receive Poll');
    fireEvent.click(receivePoll);
    await waitFor(() => expect(handleReceivePollApi).toHaveBeenCalledTimes(1));
  });
});

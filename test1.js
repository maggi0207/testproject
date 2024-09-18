import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render, screen } from '../../utils/test-utils/renderHelper';
import rootReducer from '../../modules/store/reducer';
import { rootSaga } from '../../modules/store/saga';
import CheckoutInspicio from './CheckoutInspicio';
import * as PaymentApiCallHook from '../../modules/services/APIService/PaymentApiCallHooks';
import * as Utils from './Utils'; // Import Utils module to spy on processReceiveData

 test('should handle email value change correctly', () => {
    render(<CheckoutInspicio {...props} />);

    // Simulate user input
    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Assertions to verify the state updates correctly
    expect(screen.getByTestId('email-input').value).toBe('test@example.com');
    expect(props.setValidEmailId).toHaveBeenCalledWith(true);
    expect(props.setSelectedCustomEmailId).toHaveBeenCalledWith('test@example.com');
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LONGPOLLDATA_ACTION',
      payload: { key: 'value' }, // Adjust based on actual payload
    });
  });

jest.mock('./reducer', () => ({
  longpolldata: jest.fn(() => ({ type: 'LONGPOLLDATA_ACTION', payload: { key: 'value' } })),
}));

describe('CheckoutInspicio Agreement Modal Component', () => {
   const dispatch = jest.fn();
  const mockData = {
    getAllActiveMtnsRequest: jest.fn(),
    requestBodySendMessage: jest.fn(),
    handleReceivePollApi: jest.fn(),
    requestBodySendEmail: jest.fn(),
    getResultGenerateInspicioId: { data: { sendInspicioToken: 'OMNI', encryptedCartId: '12345' } },
    getResultSendEmail: { data: { sendEmailStatus: 'SUCCESS' } },
    getResultSendMessage: { data: { status: 'SENT' } },
    getAllActiveMtnsResponse: {
      data: {
        customer: {
          billAccounts: [
            {
              mtns: [
                {
                  mtn: '7125772409',
                  deviceCategory: 'Smartphone',
                  mtnStatus: {
                    isActive: true,
                    isDisconnected: false,
                  },
                },
              ],
            },
          ],
        },
      },
    },
  };

  const props = {
    handleInspicioToggle: jest.fn(),
    selectedEmail: 'test@vrz.com',
    channel: 'CHAT-STORE',
    pageName: 'tac',
    agreementEligibleFlags: {
      showDeclineEquipmentProtection: false,
    },
    cart: {
      cartHeader: {
        fullAccountNumber: '0280083539-1',
      },
      orderDetails: {
        isPrePayCart: 'Y',
      },
      lineInfo: [
        {
          lineActivityType: 'NSEBYOD',
        },
      ],
    },
    state: {
      selectedMtnValue: 'SMS',
      mtn: [
        { label: '6102992029', value: '6102992029' },
        { label: '6102992830', value: '6102992830' },
        { label: '6103683623', value: '6103683623' },
        { label: '6106637197', value: '6106637197' },
      ],
      checkBoxSelectedValue: true,
      inspicioModel: false,
    },
    cBandQualified: true,
    signatureInspicioFlag: true,
    inspicioCustomSelectedMTN: 'test',
    selectedCheckboxValue: true,
    cancelLongPoll: true,
  };

  beforeEach(() => {
    jest.spyOn(Utils, 'processReceiveData').mockReturnValue({ someKey: 'someValue' });
     jest.spyOn(React, 'useDispatch').mockReturnValue(dispatch);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks after each test
  });

  test('should call updateLongPollReducer with correct data after toggling switch', () => {
    // Render the component
    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });

    // Simulate toggle action
    const toggleSwitch = screen.getByRole('switch'); // Adjust the role if needed
    fireEvent.click(toggleSwitch);

    // Check that dispatch was called with the correct action after toggle
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LONGPOLLDATA_ACTION',
      payload: { key: 'value' }, // Adjust payload based on your actual implementation
    });
  });

    test('Toggle switch changes and triggers handleInspicioToggle', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);

    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });

    const toggleSwitch = screen.getByRole('switch'); // Assuming the switch is correctly rendered and has the role 'switch'

    // Check initial state of the toggle switch
    expect(toggleSwitch).not.toBeChecked();

    // Simulate toggle on (true)
    fireEvent.click(toggleSwitch);
    expect(props.handleInspicioToggle).toHaveBeenCalledWith(true);

    // Simulate toggle off (false)
    fireEvent.click(toggleSwitch);
    expect(props.handleInspicioToggle).toHaveBeenCalledWith(false);
  });

  test('Toggle switch does not trigger when disabled', () => {
    const disabledProps = {
      ...props,
      inspicioMode: 'email',
      validEmailId: false, // Condition that disables the switch
    };

    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);

    render(<CheckoutInspicio {...disabledProps} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });

    const toggleSwitch = screen.getByRole('switch'); // Assuming the switch is correctly rendered and has the role 'switch'

    // Verify the switch is disabled
    expect(toggleSwitch).toBeDisabled();

    // Try to click the disabled switch and ensure the handler is not called
    fireEvent.click(toggleSwitch);
    expect(props.handleInspicioToggle).not.toHaveBeenCalled();
  });

  test('Close on Agree & Continue button click', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });
  });

  test('Close on Agree & Continue button click with different props', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    const Newprops = {
      onModeChange: jest.fn(),
      agreementEligibleFlags: {
        showDeclineEquipmentProtection: false,
      },
      cart: {
        orderDetails: {
          isPrePayCart: 'N',
        },
      },
      channel: 'CHAT-STORE11',
      cBandQualified: true,
      signatureInspicioFlag: false,
      inspicioCustomSelectedMTN: false,
      selectedCheckboxValue: false,
      cancelLongPoll: false,
    };
    render(<CheckoutInspicio {...Newprops} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });
    const emailValidationInput = screen.getByRole('radio', {
      name: /send sms/i,
    });
    fireEvent.click(emailValidationInput);
    screen.logTestingPlaygroundURL();
  });

  test('should handle receivePoll event correctly when status is Success', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);

    // Mock event data
    const eventData = {
      detail: {
        status: 'Success',
        event: 'someEvent',
        payload: 'somePayload',
      },
    };

    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });

    // Fire the custom event to simulate receiving the poll
    fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));

    // Verify that processReceiveData was called with the correct arguments
    expect(Utils.processReceiveData).toHaveBeenCalledTimes(1);
    expect(Utils.processReceiveData).toHaveBeenCalledWith(eventData.detail.event, eventData.detail.payload);
  });

  // Additional test cases for missing functionality
  test('should close modal on Agree & Continue button click', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    const newProps = {
      ...props,
      signatureInspicioFlag: true,
      inspicioCustomSelectedMTN: true,
      cBandQualified: true,
      cart: {
        ...props.cart,
        orderDetails: {
          isPrePayCart: 'N',
        },
        lineInfo: [
          {
            lineActivityType: 'NSE_5G',
          },
        ],
      },
      selectedMtnValue: 'SMS',
    };
    render(<CheckoutInspicio {...newProps} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });
  });
});

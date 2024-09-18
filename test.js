import React from 'react';
import { fireEvent } from '@testing-library/react';

import { render, screen } from '../../utils/test-utils/renderHelper';
import rootReducer from '../../modules/store/reducer';
import { rootSaga } from '../../modules/store/saga';
import CheckoutInspicio from './CheckoutInspicio';
import * as PaymentApiCallHook from '../../modules/services/APIService/PaymentApiCallHooks';

describe('CheckoutInspicio Agreement Modal Component', () => {
  // const mockCloseModalFn = jest.fn();
  // const handleInspicioToggle = jest.fn();
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

  const mockprocessReceiveData = jest.fn();

  jest.mock('./Utils', () => ({
    processReceiveData: mockprocessReceiveData,
  }));

  beforeAll(() => { });


  beforeEach(() => {
    // const BPData = agreementSummary?.messages?.backupAgreementDescription;
    // eslint-disable-next-line no-unused-expressions
    sessionStorage.getItem('suspended') === 'suspended';
  });

  test('Close on Agree & Continue button click 0', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    jest.fn();
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
    screen.getByRole('radio', {
      name: /send sms/i,
    });

    // const email = 'VQNROOVI70@VZW.COM';
    const emailValidationInput = screen.getByRole('radio', {
      name: /send sms/i,
    });
    // const emailInput = within(emailValidationInput).getByRole('radio', {
    //   name: /send sms/i
    // })
    fireEvent.click(emailValidationInput);
    // fireEvent.change(emailValidationInput, { target: { value: '' } });
    // fireEvent.change(emailValidationInput, { target: { value: email } });
    // expect(emailValidationInput).toHaveValue(email);
    screen.logTestingPlaygroundURL();
  });

  test('Close on Agree & Continue button click', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });
  });

  test('Close on Agree & Continue button click 1', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    // const newProps = {
    //     ...props,
    //     signatureInspicioFlag: true,
    //     inspicioCustomSelectedMTN: true,
    //     cBandQualified: true,
    //     cart: {
    //         orderDetails: {
    //             isPrePayCart: "N"
    //         },
    //         lineInfo: [
    //             {
    //                 lineActivityType: "NSE_5G"
    //             }
    //         ]
    //     },
    //     selectedMtnValue: "SMS"
    // }
    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });
    // screen.logTestingPlaygroundURL();
  });

  test('should handle receivePoll event correctly when status is Success', () => {
    jest.spyOn(PaymentApiCallHook, 'default').mockImplementation(() => mockData);
    // Mock event data
    const eventData = {
      detail: {
        status: "Success",
        event: 'someEvent',
        payload: 'somePayload'
      }
    };

    const receiveData = { someKey: 'someValue' };

    mockprocessReceiveData.mockReturnValue(receiveData);

    render(<CheckoutInspicio {...props} />, {
      reducers: rootReducer,
      sagas: rootSaga,
    });

    fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));
    expect(mockprocessReceiveData).toHaveBeenCalledTimes(1);

    // expect(mockUpdateLongPollReducer).toHaveBeenCalledTimes(1);
  });
});

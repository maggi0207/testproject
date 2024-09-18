import React from 'react';
import { fireEvent, screen, render } from '@testing-library/react';
import rootReducer from '../../modules/store/reducer';
import { rootSaga } from '../../modules/store/saga';
import CheckoutInspicio from './CheckoutInspicio';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

// Create a custom render function that includes Redux and Saga setup
const customRender = (ui, { initialState, ...renderOptions } = {}) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = configureStore({
        reducer: rootReducer,
        middleware: [sagaMiddleware],
        preloadedState: initialState,
    });

    sagaMiddleware.run(rootSaga);

    return render(<Provider store={store}>{ui}</Provider>, renderOptions);
};

describe('CheckoutInspicio Agreement Modal Component', () => {
    const defaultProps = {
        cart: {
            lineDetails: {
                lineInfo: [
                    {
                        lineActivityType: 'NSE',
                        serviceInfo: {
                            primaryUserInfo: {},
                        },
                    },
                ],
            },
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
        cancelLongPoll: false,
    };

    beforeEach(() => {
        customRender(<CheckoutInspicio {...defaultProps} />, {
            reducers: rootReducer,
            sagas: rootSaga,
        });
    });

    it('renders correctly', () => {
        expect(screen.getByText('Send SMS')).toBeInTheDocument();
        expect(screen.getByText('Send Email')).toBeInTheDocument();
        expect(screen.getByText('Inspicio mode')).toBeInTheDocument();
    });

    it('handles radio button change', () => {
        const radioButton = screen.getByLabelText('Send SMS');
        fireEvent.click(radioButton);
        expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
    });

    it('handles dropdown select change', () => {
        const dropdownSelect = screen.getByText('1234567890');
        fireEvent.click(dropdownSelect);
        expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
    });

    it('handles email input change', () => {
        const emailInput = screen.getByPlaceholderText('Email');
        fireEvent.change(emailInput, { target: { value: 'new-email@example.com' } });
        expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
    });

    it('handles switch toggle', () => {
        const switchToggle = screen.getByRole('switch');
        fireEvent.click(switchToggle);
        expect(defaultProps.toggleInspicio).toHaveBeenCalledTimes(1);
    });

    it('renders ReceivePoll component', () => {
        expect(screen.getByText('Receive Poll')).toBeInTheDocument();
    });

    it('calls handleReceivePollApi function', async () => {
        const handleReceivePollApi = jest.fn();
        customRender(
            <CheckoutInspicio {...defaultProps} handleReceivePollApi={handleReceivePollApi} />
        );
        const receivePoll = screen.getByText('Receive Poll');
        fireEvent.click(receivePoll);
        await waitFor(() => expect(handleReceivePollApi).toHaveBeenCalledTimes(1));
    });
});

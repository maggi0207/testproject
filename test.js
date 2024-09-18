import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../../modules/store/reducer';
import { rootSaga } from '../../modules/store/saga';
import CheckoutInspicio from './CheckoutInspicio';

// Configure the store with reducer and saga middleware
const configureStore = (initialState = {}) => {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(sagaMiddleware)
    );
    sagaMiddleware.run(rootSaga);
    return store;
};

describe('CheckoutInspicio component', () => {
    let store;

    beforeEach(() => {
        store = configureStore(); // Configure store before each test
        render(
            <Provider store={store}>
                <CheckoutInspicio {...defaultProps} />
            </Provider>
        );
    });

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
        render(
            <Provider store={store}>
                <CheckoutInspicio {...defaultProps} handleReceivePollApi={handleReceivePollApi} />
            </Provider>
        );
        const receivePoll = screen.getByText('Receive Poll');
        fireEvent.click(receivePoll);
        await waitFor(() => expect(handleReceivePollApi).toHaveBeenCalledTimes(1));
    });
});

import React from "react";
import { render, screen, fireEvent, waitFor, within } from '../../test-utils/renderHelper';
import { setupChannel, CHANNELS, getApiContext, wait } from '../../test-utils/utils';
import CheckoutInspicio, { mapStateToProps, mapDispatchToProps, CheckoutInspicio as CheckoutInspicioObj } from './CheckoutInspicio';
import orederReviewReducer from "../../pages/OrderReview/reducer";
import * as longpollActions from "../LongPoll/actions";
import { state, getStoreInformationResponse } from "../../components/OrderReview/CartShippingDetails/__mocks__/PickUpDetailsMockData"
import * as actions from "../../pages/OrderReview/actions";
import * as landingActions from "../../pages/Landing/actions";
import { checkoutInspicioProps, generateInspicioId_Api, generateInspicioId_Response, retrieveCart_Response, longPollResponseForIGError, sendMessage_Response, checkoutProps, landingProps, checkoutManagePageNameProps, cashPaymentPageNameProps, longPollResponse_zipcode, longPollResponseForIGErroraddressSelected, longPollResponseForIGErrormgrApprovalEnableSubmit, longPollResponseForIGErroruseWallet, longPollResponseForIGErrorenableSubmit, longPollResponseForIGErroripAddress, longPollResponseForIGErrorgiftPurchaseCheck, longPollResponseForIGErrortacSubmit, longPollResponseForIGErrortacsignature, longPollResponseForIGErrorenableSubmitisLov, longPollResponseForgcPayment, longPollResponseForgcBalanceCheck, longPollResponse_agreementsData, longPollResponse_submitClicked, expirationMock,  longPollResponse_number } from "./__mocks__/CheckoutInspicioMockData";
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import longPollSaga from "../LongPoll/saga";
import * as appMessageActions from "../common/AppMessage/actions";
import * as checkoutAction from "../../pages/Checkout/actions"
import INJECTOR_KEYS from "../../services/InjectorKeyService";
import longPollReducer, { INITIAL_STATE } from "../LongPoll/reducer";
import appReducer, { INITIAL_STATE as APP_INITIAL_STATE }  from "../App/reducer";
import landingReducer, {INTIAL_STATE as LANDING_INITIAL_STATE} from "../../pages/Landing/reducer";
import checkoutReducer from "../../pages/Checkout/reducer";
import * as Service from "../../services/HttpService";
import {preloadedState_CheckoutInspicio,checkoutInspicio_Props} from './__mocks__/CheckoutInspicio/CheckoutInspicioTestData';
import { openRepEmulatorResp } from "./__mocks__/Lov-CHeckoutInspicioMockData";
import { STATE } from "../LovAgreement/Payment/mocks/store/reduxMock";

import configureStore from "../../configureStore";

const timeout = 30000;
jest.setTimeout(timeout);
const initialRoute = "checkout";
const sendInpsicioEmail = jest.spyOn(longpollActions, "sendInpsicioEmail");
const landingKey = INJECTOR_KEYS.LANDING_PAGE;
const checkoutKey = "Checkout";

const Test = (channel) => {
    const orderReviewKey = 'OrderReview';
    setupChannel(channel)
    const handlers = [
        rest.post(`*/inspicioservice/inspicio/generateInspicioID`, (req, res, ctx) => {
            console.log("generateinspicio");
            return res(ctx.status(200), ctx.json(generateInspicioId_Response),);
        }),
        rest.post(`*/cartservice/cart/retrieve-cart`, (req, res, ctx) => {
            console.log("retrievecart");
            return res(ctx.status(200), ctx.json(retrieveCart_Response),);
        }),
        rest.post("*/inspicioservice/inspicio/sendMessage", (req, res, ctx) => {
            console.log("sendMessage");
            return res(ctx.status(200), ctx.json(sendMessage_Response),);
        }),
        rest.post("*/peripheralsservice/jsNotifyAsDynamic", (req, res, ctx) => {
            console.log("sendMessage");
            return res(ctx.status(200));
        }),
        rest.post("*paymentservice/generateQRCode", (req, res, ctx) => {
            console.log("generateQRCode");
            return res(ctx.status(200), ctx.json(generateInspicioId_Response));
        }),
       
    ];

    const server = setupServer(...handlers);
    describe(`UpgradeOption Component - ${channel}`, () => {
        let wrapper;
        let store, asFragment, component;

        const addressValidation ={
            qualificationDetails: {
                fiveGHomeQualified: true,
                cBandQualified: true,
                LTEQualified: true,
              },
        }
        const state={
            checkout:{

                orderBalance:234
            }
        }

        beforeAll(() => server.listen()
        )
        window.clipboardData = jest.fn(() => true);
        clipboardData.setData = jest.fn(() => { });
        const clearSignature = jest.fn().mockName('clearSignature');
        const handleMtnChange =jest.fn().mockName('handleMtnChange');
        checkoutInspicioProps.inspicioMode = 'sms';
        checkoutInspicioProps.landing.cartDetails.lineInfo.lineActivityType ="AAL";
        checkoutInspicioProps.landing.assistedFlags.isInspicioDirectCallsForChannelEnabled = "TRUE";
        checkoutInspicioProps.landing.isMidnightRedeem = true;
        checkoutInspicioProps.midnightRedemptionFlow = true;
        // checkoutInspicioProps.selectedCheckboxValue ="false";
        checkoutInspicioProps.Checkout.orderBalance = "999"
        beforeEach(() => {
            sessionStorage.setItem("viewTogetherEnabled", JSON.stringify(false));
            sessionStorage.setItem("APIContext", getApiContext(channel));
           
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio
                    {...state}
                    isCoreRepORWfm={'Y'}
                    selectedMtnValue={"5162731074"}
                    userEmail="test@mail.com"
                    coBrowseLabel="test"
                    showtouchlessOption={true}
                    techCoachRep="false"
                    inspicioToggleOn="true"
                    disableInspicioChangeTechCoach="false"
                    postToNewPreIndicator="false"
                    clearSignature={clearSignature}
                    handleMtnChange={handleMtnChange}
                    addressValidation={addressValidation}
                    {...checkoutInspicioProps} />,
                { ...checkoutProps, ...generateInspicioId_Response },
                {
                    reducers:
                    {
                        [orderReviewKey]: orederReviewReducer,
                        [landingKey]: landingReducer,
                    [checkoutKey]: checkoutReducer,
                    },
                    preloadedState: checkoutProps,state,checkoutProps,
                    initialRoute
                }
            ))

        });

        afterEach(() => {
            // cleanup();
            server.resetHandlers();
        })

        // component loading check 
        test("it should mount", () => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();

        });
        test("should checked Send Email from  Sent email", async () => {
            const inspicio_mode = component.container.querySelector('[id="inspicioRadioButtons"]')
            expect(component.container.querySelector('[id="inspicioRadioButtons"]')).toBeInTheDocument();
            expect(component.container.querySelector('[role="radiogroup"]')).toBeInTheDocument();
            expect(component.container.querySelector('[role="radio"]')).toBeInTheDocument();
            fireEvent.click(inspicio_mode)
            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            expect(radiobtn).toBeChecked()
            await waitFor(() => { expect(screen.getByRole("textbox", { name: "Optional Input Field" })).toHaveValue(checkoutInspicioProps.selectedEmail) })
            await waitFor(() => { expect(sendInpsicioEmail).toBeCalled });

        })
        test("should  check Send Sms and display 'SMS sent to' on initial mount", async () => {
            const radiobtn = screen.getByRole("radio", { name: "Send Sms" });
            expect(screen.getByRole("button", { name: checkoutInspicioProps.selectedMtnValue })).toBeInTheDocument()

        })

        test("should display EMAIL sent to", async () => {
            render(<CheckoutInspicio
                inspicioMode="email"
                />)
            const inspicio_mode = component.container.querySelector('[id="inspicioRadioButtons"]')
            fireEvent.click(inspicio_mode)
            const radiobtn = screen.getAllByText("Send Email")[0];
            expect(radiobtn).toBeInTheDocument();
            fireEvent.click(radiobtn);
            expect(screen.getByRole("textbox", { name: "Optional Input Field" })).toHaveValue(checkoutInspicioProps.selectedEmail)
            fireEvent.click(inspicio_mode)
        })

        test("should display warning message on entering invalid email address", async () => {
            const inspicio_mode = component.container.querySelector('[id="inspicioRadioButtons"]')
            fireEvent.click(inspicio_mode)
            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            const email_input = screen.getByRole("textbox", { name: "Optional Input Field" })
            fireEvent.change(email_input, { target: { value: "" } });
            fireEvent.blur(email_input)
            expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()
            fireEvent.change(email_input, { target: { value: "abc@gmail.com" } });
            fireEvent.blur(email_input)
            fireEvent.click(inspicio_mode)

        })

        test("should display new email address when user changes email address", async () => {
            const inspicio_mode = component.container.querySelector('[id="inspicioRadioButtons"]')
            fireEvent.click(inspicio_mode)
            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            const email_input = screen.getByRole("textbox", { name: "Optional Input Field" })
            fireEvent.change(email_input, { target: { value: "abc@gmail.com" } });
            fireEvent.blur(email_input)
            fireEvent.click(inspicio_mode)

        })

        test("should not display inspicio  details", () => {
            expect(component.container.querySelector('[id="inspicioEmail"]')).not.toBeInTheDocument();
        })
        test('display inspicio toogle switch', () => {
            const toggleBtn = screen.getByRole("switch", { target: { value: "false" } });
            fireEvent.change(toggleBtn, { target: { value: "true" } });
            fireEvent.click(toggleBtn);
        });

        test('should test maps state to props', () => {
            const initialState = {
                salesRep: "",
                cartId: "",
                locationCode: "",
                enableBackupPayment: undefined,
                clientId: sessionStorage.getItem("channel"),
                regNo: "",
                orderNumber: "",
                caseId: "",
                userId: "",
                orderBalance: 0,
                accountNumber: "",
                getSentEmailFlag: false,
                midnightRedemptionFlow: false,
                genInspicioTokenRunning: false,
                getSubmitPaymentCount: 0,
                viewTogetherBtnEnabled: false,
                viewTLiteClicked: false,
                paymentDetails: [],
            };
            expect(mapStateToProps(initialState).salesRep).toEqual("");
            expect(mapStateToProps(initialState).cartId).toEqual("");
            expect(mapStateToProps(initialState).locationCode).toEqual("");
            expect(mapStateToProps(initialState).enableBackupPayment).toEqual(undefined);
            expect(mapStateToProps(initialState).clientId).toEqual(sessionStorage.getItem("channel"));
            expect(mapStateToProps(initialState).regNo).toEqual("");
            expect(mapStateToProps(initialState).orderNumber).toEqual("");
            expect(mapStateToProps(initialState).caseId).toEqual("");
            expect(mapStateToProps(initialState).userId).toEqual("");
            expect(mapStateToProps(initialState).orderBalance).toEqual(0);
            expect(mapStateToProps(initialState).accountNumber).toEqual("");
            expect(mapStateToProps(initialState).genInspicioTokenRunning).toEqual(false);
            expect(mapStateToProps(initialState).midnightRedemptionFlow).toEqual(false);
            expect(mapStateToProps(initialState).getSubmitPaymentCount).toEqual(0);
            expect(mapStateToProps(initialState).viewTogetherBtnEnabled).toEqual(false);
            expect(mapStateToProps(initialState).viewTLiteClicked).toEqual(false);
            expect(mapStateToProps(initialState).paymentDetails).toEqual([]);
        });
        test('should test maps dispatch to props', () => {
            const dispatch = jest.fn();
            mapDispatchToProps(dispatch).addAppMessage();
            mapDispatchToProps(dispatch).getLongPollData();
            mapDispatchToProps(dispatch).setSentEmailFlag();
            mapDispatchToProps(dispatch).setInpspicioToggeleValue();
            mapDispatchToProps(dispatch).cancelLongPoll();
            mapDispatchToProps(dispatch).setInspicioToken();
            mapDispatchToProps(dispatch).setInspicioRecieveToken();
            mapDispatchToProps(dispatch).setClusterId();
            mapDispatchToProps(dispatch).sendInpsicioEmail();
            mapDispatchToProps(dispatch).clearInspicioToken();
            mapDispatchToProps(dispatch).setIsSignaturePage();
            expect(dispatch.mock.calls[0][0]).toEqual({ type: '[APP_MESSAGE] ADD', "payload": {} });
            expect(dispatch.mock.calls[1][0]).toEqual({ type: 'GET_LONGPOLL_DATA' });
            expect(dispatch.mock.calls[2][0]).toEqual({ type: 'SENT_EMAIL' });
            expect(dispatch.mock.calls[3][0]).toEqual({ type: 'SET_INSPICIO_TOGGLE_VALUE' });
            expect(dispatch.mock.calls[4][0]).toEqual({ type: 'CANCEL_LONGPOLL' });
            expect(dispatch.mock.calls[5][0]).toEqual({ type: 'SET_INSPICIO_TOKEN' });
            expect(dispatch.mock.calls[6][0]).toEqual({ type: 'SET_INSPICIO_RECEIVE_TOKEN' });
            expect(dispatch.mock.calls[7][0]).toEqual({ type: 'SET_CLUSTER_ID' });
            expect(dispatch.mock.calls[9][0]).toEqual({ type: 'CLEAR_INSPICIO_TOKEN' });
            expect(dispatch.mock.calls[10][0]).toEqual({ type: 'SET_IS_SIGNATURE_PAGE' });

        })

        test("should complete payment", async () => {
            store.dispatch(actions.getStoreInfoSuccess(getStoreInformationResponse));
            await new Promise((r) => setTimeout(r, 5000));
        });

        afterEach(() => {
            // @ts-ignore jest.spyOn adds this functionallity
            //console.error.mockRestore();
        });

    });

    describe(`CheckoutInspicio Component `, () => {
        let store, asFragment, component;
       
        beforeAll(() => server.listen());
        window.clipboardData = jest.fn(() => true);
        clipboardData.setData = jest.fn(() => { });
        sessionStorage.setItem("channel", "CHAT-STORE");

        beforeEach(() => {
            sessionStorage.setItem("viewTogetherEnabled", JSON.stringify(false));
            sessionStorage.setItem("APIContext", getApiContext(channel));
            sessionStorage.getItem("channel");
            const getBackupPaymentFlagForPayment = jest.fn().mockName('getBackupPaymentFlagForPayment');
            ({ store, asFragment, ...component } = render(
            <CheckoutInspicio
            userEmail= "test@verizon.com"
            getInspicioToggleValue={false}
            getSubmitPaymentError={true}
            genInspicioTokenRunning={false}
            selectedMtnValue={"5162731074"}
            getBackupPaymentFlagForPayment={getBackupPaymentFlagForPayment}
                {...checkoutProps} />,
                { ...landingProps },
                {
                    reducers:
                    {
                        [orderReviewKey]: orederReviewReducer,
                        ['App']: appReducer,
                        [landingKey]: landingReducer,
                        [checkoutKey]: checkoutReducer,
                    },
                    preloadedState: state,landingProps,checkoutProps
                }
            ))

        });

        test("it should mount", () => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();
        });
        test("should not display inspicio  details", () => {
            const inspoEmail = component.container.querySelector('[id="inspicioEmail"]')
            expect(inspoEmail).not.toBeInTheDocument();
        })
        test("should display copy link button", () => {
            const inspicio_mode = component.container.querySelector('[id="copyLinkBtn"]');
            fireEvent.click(inspicio_mode);
        });
        test("display copy spanish link button ", () => {
            const inspicio_mode = component.container.querySelector('[id="copySpanishLinkBtn"]');
            fireEvent.click(inspicio_mode);
        });
        test('display inspicio toogle switch', () => {
            const toggleBtn = screen.getByRole("switch", { target: { value: "false" } });
            fireEvent.change(toggleBtn, { target: { value: "true" } });
            fireEvent.click(toggleBtn);
        });

        test('should test maps state to props', () => {
            expect(mapStateToProps(landingProps).caseId).toBe("SOP-7622043-E01");
        })

        test ("allow mannual payment false",()=>{
            const dispatch = jest.fn();
        // const state = {checkout:{orderBalance:234 }};
        // store.dispatch(checkoutAction.submitPaymentSuccess({type:'SUBMIT_PAYMENT_SUCCESS',checkoutProps.checkout.orderBalance}))
        // mapDispatchToProps(dispatch).submitPaymentSuccess({type:'SUBMIT_PAYMENT_SUCCESS',payload:landingProps.checkout})
        })

        test('address validation',()=>{
            const props ={
                addressValidation:{
                    qualificationDetails:{
                        fiveGHomeQualified:true,
                        cBandQualified:true,
                        LTEQualified:true
                    }
                },
            }
            render(<CheckoutInspicio state={props}  retailIpadAgreementContentFlag={true} selectedMtnValue={"Select from drop down"} />)
          })


          test('unpdate did getInspicioToggleValue',()=>{
            const {rerender}=render(<CheckoutInspicio getInspicioToggleValue={false} genInspicioTokenRunning={false} />);
            rerender(<CheckoutInspicio getInspicioToggleValue={true}  />)
          })

          test('unpdate did getSubmitPaymentError',()=>{
            const {rerender}=render(<CheckoutInspicio getSubmitPaymentError={true} genInspicioTokenRunning={false} />);
            rerender(<CheckoutInspicio getSubmitPaymentError={false}  />)
          })

         
    })

    describe(`CheckoutInspicio Component other `, () => {
        let store, asFragment, component;
        const state={
            checkout: {
                orderBalance:234
            },
        }
        beforeAll(() => server.listen());
        checkoutProps.pageName == "managerApproval";

        navigator.clipboard = jest.fn();
        navigator.clipboard.writeText = jest.fn("https://vzwqa3.verizonwireless.com/lov/cardinal-payments.html?p=QUdFTlQtQ0hBVC1TVE9SRS00YWE0MTg1NS1iNWZkLTQwOzcwODBNWEpTR0tQcTE5YWU4Wkh5cXc=&q=Y&i=S&o=owuXdWw16EnwdPX6oPF0QAUYIifaEKMAt2t3oiRosyQ&c=CHAT-STORE&es=Y");
        beforeEach(() => {
            ({ store, asFragment, ...component } = render(
            <CheckoutInspicio
                 selectedMtnValue={"5162731074"}
                 genInspicioTokenRunning={false}
                 pageName = "cardinalPayment" 
                 state={state}
                 {...checkoutManagePageNameProps} />,

                {
                    reducers:
                    {
                        [orderReviewKey]: orederReviewReducer,
                        ['App']: appReducer,
                        [landingKey]: landingReducer,
                        [checkoutKey]: checkoutReducer,
                    },
                    preloadedState: state,landingProps,
                    
                }
            ))

        });

        test("it should mount", () => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();
        });
        test("should display copy link button", () => {
            const inspicio_mode = component.container.querySelector('[id="copyLinkBtn"]');
            fireEvent.click(inspicio_mode);
        });
        test("display copy spanish link button ", () => {
            const inspicio_mode = component.container.querySelector('[id="copySpanishLinkBtn"]');
            fireEvent.click(inspicio_mode);
        });

       
       test ("page tncagreement ",()=>{
        render(<CheckoutInspicio pageName={'tncagreement'} {...landingProps}/>)
       })
       test ("allow mannual payment false",()=>{
        const channelDisplayFlags={
            showMdnSelectionInIndirect:true,
            allowManualPayment:false
        }
        landingProps.Checkout ={
            orderBalance:234
        }

        render(<CheckoutInspicio channelDisplayFlags={channelDisplayFlags}  {...landingProps}/>)
       })

    })

    describe(`CheckoutInspicio manage Component `, () => {
        let store, asFragment, component;

        beforeAll(() => server.listen());


        navigator.clipboard = jest.fn();
        navigator.clipboard.writeText = jest.fn("https://vzwqa3.verizonwireless.com/lov/cardinal-payments.html?p=QUdFTlQtQ0hBVC1TVE9SRS00YWE0MTg1NS1iNWZkLTQwOzcwODBNWEpTR0tQcTE5YWU4Wkh5cXc=&q=Y&i=S&o=owuXdWw16EnwdPX6oPF0QAUYIifaEKMAt2t3oiRosyQ&c=CHAT-STORE&es=Y");
        beforeEach(() => {

            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio
                    channel="OMNI-RETAIL"
                    pageName="managerApproval" />,

                {
                    reducers:
                    {
                        [orderReviewKey]: orederReviewReducer,
                        ['App']: appReducer,
                    },
                    preloadedState: state,checkoutProps
                }
            ))

        });

        test("it should mount", () => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();
        });

        test('display inspico switch button', () => {
            expect(screen.getByTestId("inspicoToggleSwitch")).toBeInTheDocument();
        })

        test('display inspicio toogle switch', () => {
            const toggleBtn = screen.getByRole("switch", { target: { value: "false" } });
            fireEvent.change(toggleBtn, { target: { value: "true" } });
            fireEvent.click(toggleBtn);
        });

    })

    describe(`CheckoutInspicio cashPayment Component `, () => {
        let store, asFragment, component;

        beforeAll(() => server.listen());

         beforeEach(() => {
            sessionStorage.setItem("APP_PROPERTIES", JSON.stringify({isMultiLineRisaEnabled: "FALSE"}));
            sessionStorage.setItem("APIContext", getApiContext(channel));
            cashPaymentPageNameProps.OrderReview.cart.orderDetails.orderNumber="";
            cashPaymentPageNameProps.savedCardCCDetails ="";
            cashPaymentPageNameProps.pageName = "cashPayment";
            cashPaymentPageNameProps.orderNumbers[0].orderNumber = 0;
            const sendMessage = jest.fn();
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio
                    channel="CHAT-STORE"
                    sendMessage={sendMessage}
                    {...cashPaymentPageNameProps} />,

                    {
                        reducers:
                        {
                            [orderReviewKey]: orederReviewReducer,
                            ['App']: appReducer,
                        },
                        preloadedState: state,landingProps
                    }
            ))

        });

        test("it should mount", () => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();
        });

        test("should mount props",()=>{
            const {rerender}=render(<CheckoutInspicio getSubmitPaymentError={true} genInspicioTokenRunning={false}/>);
            rerender(<CheckoutInspicio getSubmitPaymentError={false}/>)
            screen.debug()
        })
        afterAll(() => {
            server.close();
        });

    })
    describe(`CheckoutInspicio cashPayment Component `, () => {
        let store, asFragment, component;

        beforeAll(() => server.listen());

         beforeEach(() => {
            sessionStorage.setItem("APIContext", getApiContext(channel));
            sessionStorage.setItem("APP_PROPERTIES", JSON.stringify({isMultiLineRisaEnabled: "FALSE"}));
            cashPaymentPageNameProps.OrderReview.cart.orderDetails.orderNumber="";
            cashPaymentPageNameProps.savedCardCCDetails ="";
            cashPaymentPageNameProps.pageName = "cashPayment";
            cashPaymentPageNameProps.orderNumbers[0].orderNumber = 0;
            const sendMessage = jest.fn();
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio
                    channel="CHAT-STORE"
                    sendMessage={sendMessage}
                    {...cashPaymentPageNameProps} />,

                    {
                        reducers:
                        {
                            [orderReviewKey]: orederReviewReducer,
                            ['App']: appReducer,
                        },
                        preloadedState: state,landingProps
                    }
            ))

        });

        test("it should mount", () => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();
        });

        test("should mount props",()=>{
            const {rerender}=render(<CheckoutInspicio getSubmitPaymentError={true} genInspicioTokenRunning={false}/>);
            rerender(<CheckoutInspicio getSubmitPaymentError={false}/>)
            screen.debug()
        })
        afterAll(() => {
            server.close();
        });

    })


    describe(`CheckoutInspicio - long polling`, () => {
        let store, asFragment, component;
        let handlers1 = handlers;
        handlers.push(
            rest.post(`*inspicioservice-uat.vzwcorp.com/inspicio/receive`, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(longPollResponseForIGError));
            })
        );
        const server1 = setupServer(...handlers1);
        function* rootSaga() {
            yield all([longPollSaga()]);
        }

        beforeAll(() => server1.listen());

        beforeEach(() => {
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio channel="OMNI-TELESALES" orderNumbers="20041380" agreementEligibleFlags={{}} {...landingProps}/>,
                {
                    reducers:
                    {
                        [orderReviewKey]: orederReviewReducer,
                        [INJECTOR_KEYS.LONG_POLL]: longPollReducer,
                        ['App']: appReducer,
                        ['landing']: landingReducer
                    },
                    sagas: rootSaga,
                    preloadedState: {
                        landingProps,
                        ...state,
                        landing: {
                            assistedFlags: {
                                ...state.landing.assistedFlags,
                                isInspicioCCDEnabled: "TRUE"
                            },
                            isMidnightRedeem :"true",  
                        },
                        OrderReview:{
                            lovData:{
                                    ...state.OrderReview.lovData,
                                    selectedMode:"deviceStatus"
                                }
                        }
                    }
                }
            ))

        });

        test('should trigger IG error', async () => {
            expect(screen.getByTestId("inspicoToggleSwitch")).toBeInTheDocument();
            //adding wait for long polling to run and capture the IG error event
            await wait(5000);
        })

    })
    describe(`CheckoutInspicio - long polling`, () => {
        let store, asFragment, component;
        let handlers1 = handlers;
        handlers.push(
            rest.post(`*inspicioservice-uat.vzwcorp.com/inspicio/receive`, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(longPollResponseForIGError));
            })
        );
        const server1 = setupServer(...handlers1);
        function* rootSaga() {
            yield all([longPollSaga()]);
        }

        beforeAll(() => server1.listen());

        beforeEach(() => {
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio channel="OMNI-CARE" pageName="tac" agreementEligibleFlags={{showNetworkExtenderTnCDiscountApplied: true}} {...landingProps}/>,
                {
                    preloadedState: state,
                }
            ))

        });

        test('should trigger IG error', async () => {
            expect(screen.getByTestId("inspicoToggleSwitch")).toBeInTheDocument();
            //adding wait for long polling to run and capture the IG error event
            await wait(5000);
        })

    })
    describe(`CheckoutInspicio - long polling`, () => {
        let store, asFragment, component;
        let handlers1 = handlers;
        handlers.push(
            rest.post(`*inspicioservice-uat.vzwcorp.com/inspicio/receive`, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(longPollResponse_zipcode ));
            })
        );
        const server1 = setupServer(...handlers1);
        function* rootSaga() {
            yield all([longPollSaga()]);
        }

        beforeAll(() => server1.listen());

        beforeEach(() => {
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio channel="OMNI-CARE" pageName="tac" agreementEligibleFlags={{}} {...landingProps}/>,
                {
                    preloadedState: state,
                }
            ))

        });

        test('should trigger IG error', async () => {
            expect(screen.getByTestId("inspicoToggleSwitch")).toBeInTheDocument();
            //adding wait for long polling to run and capture the IG error event
            await wait(5000);
        })

    })
 
}

const TestEmailValidation = (channel) => {
    setupChannel(channel);

    const handlers = [
        rest.post(`*/emailValidate`, (req, res, ctx) => {
            return res(ctx.status(200), ctx.json({"emailAddress":"test@gmail.com","validationStatus":"Valid"}));
        })
    ];

    const server = setupServer(...handlers);
    let history, store, asFragment, component;

    describe(`<CheckoutInspicio component to validate email - ${channel}`, () => {
        // Enable API mocking before tests.
        beforeAll(() => server.listen());
    
        // Reset any runtime request handlers we may add during the tests.
        afterEach(() => server.resetHandlers());
    
        // Disable API mocking after the tests are done.
        afterAll(() => server.close());
    
        const initialRoute = "checkout.html";

        beforeEach(() => {
            ({ store, asFragment, ...component } = render(<CheckoutInspicio
                {...checkoutInspicio_Props}
                />, 
                {
                    reducers: {
                        ['OrderReview']: orederReviewReducer,
                        ["landing"]: landingReducer,
                        ["App"]: appReducer,
                        ['Checkout']:checkoutReducer
                    },
                    preloadedState: preloadedState_CheckoutInspicio,
                    initialRoute,
                    mountAppMessage:true
                }
            ));
        });

        test("should verify email with valid validationStatus", async() => {
            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();

            const inspicioToggleBtn = screen.getByTestId("inspicoToggleSwitch");
            fireEvent.click(inspicioToggleBtn)
            expect(inspicioToggleBtn).not.toBeChecked();

            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            expect(radiobtn).toBeChecked();

            const emailValidationInput = screen.getByTestId("EmailValidationInput");
            expect(emailValidationInput).toBeInTheDocument();
            const emailInput = within(emailValidationInput).getByRole("textbox");
            expect(emailInput).toBeInTheDocument();

            fireEvent.change(emailInput,{target:{value:""}});
            fireEvent.blur(emailInput,{target:{value:""}});
            const emailErrorText = "Please enter a valid email address";
            await waitFor(() => expect(screen.getByText(emailErrorText)).toBeInTheDocument());
            expect(inspicioToggleBtn).toBeDisabled();

            fireEvent.focus(emailInput);
            fireEvent.change(emailInput,{target:{value:"test@gmail.com"}});
            fireEvent.blur(emailInput,{target:{value:"test@gmail.com"}});
            await waitFor(() => expect(inspicioToggleBtn).toBeEnabled());
        });

        test("should verify email with invalid validationStatus", async () => {

            server.use(
                rest.post(`*/emailValidate`, (req, res, ctx) => {
                  return res.once(ctx.status(200), ctx.json({"emailAddress":"test@vzw.com","validationStatus":"Invalid"}));
                }),
            );

            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();

            const inspicioToggleBtn = screen.getByTestId("inspicoToggleSwitch");
            fireEvent.click(inspicioToggleBtn)
            expect(inspicioToggleBtn).not.toBeChecked();

            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            expect(radiobtn).toBeChecked();

            const emailValidationInput = screen.getByTestId("EmailValidationInput");
            expect(emailValidationInput).toBeInTheDocument();
            const emailInput = within(emailValidationInput).getByRole("textbox");
            expect(emailInput).toBeInTheDocument();

            fireEvent.change(emailInput,{target:{value:"test@vzw.com"}});
            fireEvent.blur(emailInput,{target:{value:"test@vzw.com"}});
            const emailErrorText = "Please enter a valid email address";
            await waitFor(() => expect(screen.getByText(emailErrorText)).toBeInTheDocument());
            expect(inspicioToggleBtn).toBeDisabled();
        });

        test("should verify email with fake validationStatus", async () => {

            server.use(
                rest.post(`*/emailValidate`, (req, res, ctx) => {
                  return res.once(ctx.status(200), ctx.json({"emailAddress":"no@no.com","validationStatus":"Fake"}));
                }),
            );

            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();

            const inspicioToggleBtn = screen.getByTestId("inspicoToggleSwitch");
            fireEvent.click(inspicioToggleBtn)
            expect(inspicioToggleBtn).not.toBeChecked();

            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            expect(radiobtn).toBeChecked();

            const emailValidationInput = screen.getByTestId("EmailValidationInput");
            expect(emailValidationInput).toBeInTheDocument();
            const emailInput = within(emailValidationInput).getByRole("textbox");
            expect(emailInput).toBeInTheDocument();

            fireEvent.change(emailInput,{target:{value:"no@no.com"}});
            fireEvent.blur(emailInput,{target:{value:"no@no.com"}});
            // const emailErrorText = "Please enter a valid email address";
            // await waitFor(() => expect(screen.getByText(emailErrorText)).toBeInTheDocument());
            // expect(inspicioToggleBtn).toBeDisabled();
        });

        test("should verify email with manual_validation validationStatus", async () => {

            server.use(
                rest.post(`*/emailValidate`, (req, res, ctx) => {
                    return res.once(ctx.status(200), ctx.json({"emailAddress":"test@vzw.com","validationStatus":"Manual_validation"}));
                }),
                rest.post(`*/verifyEmail`, (req, res, ctx) => {
                    return res(ctx.status(200), ctx.json({"data":{"statusDescription":"Request has been successfully submitted."},"error":null}));
                }),
                rest.post(`*/emailValidate`, (req, res, ctx) => {
                    return res.once(ctx.status(200), ctx.json({"emailAddress":"test@vzw.com","validationStatus":"White_listed"}));
                }),
            );

            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();

            const inspicioToggleBtn = screen.getByTestId("inspicoToggleSwitch");
            fireEvent.click(inspicioToggleBtn)
            expect(inspicioToggleBtn).not.toBeChecked();

            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            expect(radiobtn).toBeChecked();

            const emailValidationInput = screen.getByTestId("EmailValidationInput");
            expect(emailValidationInput).toBeInTheDocument();
            const emailInput = within(emailValidationInput).getByRole("textbox");
            expect(emailInput).toBeInTheDocument();

            fireEvent.change(emailInput,{target:{value:"test@vzw.com"}});
            fireEvent.blur(emailInput,{target:{value:"test@vzw.com"}});
            await waitFor(() => expect(screen.getByRole("link",{name:"click here"})).toBeInTheDocument());

            fireEvent.click(screen.getByRole("link",{name:"click here"}));
            await waitFor(() => expect(screen.getByRole("button",{name:"Confirm"})).toBeInTheDocument());

            fireEvent.click(screen.getByRole("button",{name:"Confirm"}));
            await waitFor(() => expect(inspicioToggleBtn).toBeEnabled());
        });

        test("should verify current email address message when modifying email with same email", async () => {

            const CheckoutInspicio = screen.getByTestId("CheckoutInspicio");
            expect(CheckoutInspicio).toBeInTheDocument();

            const inspicioToggleBtn = screen.getByTestId("inspicoToggleSwitch");
            fireEvent.click(inspicioToggleBtn)
            expect(inspicioToggleBtn).not.toBeChecked();

            const radiobtn = screen.getByRole("radio", { name: "Send Email" });
            fireEvent.click(radiobtn);
            expect(radiobtn).toBeChecked();

            const emailValidationInput = screen.getByTestId("EmailValidationInput");
            expect(emailValidationInput).toBeInTheDocument();
            const emailInput = within(emailValidationInput).getByRole("textbox");
            expect(emailInput).toBeInTheDocument();

            fireEvent.focus(emailInput);
            fireEvent.change(emailInput,{target:{value:"CXT.REGRESSION@OMAIL.EBIZ.VERIZON.CO"}});
            fireEvent.change(emailInput,{target:{value:"CXT.REGRESSION@OMAIL.EBIZ.VERIZON.COM"}});
            await waitFor(() => expect(screen.getByText("Current Email Address")).toBeInTheDocument());
            expect(inspicioToggleBtn).toBeDisabled();
        });
    });

}

Test(CHANNELS.OMNI_TELESALES);
Test(CHANNELS.OMNI_RETAIL);
TestEmailValidation(CHANNELS.OMNI_TELESALES);
TestEmailValidation(CHANNELS.OMNI_RETAIL);
TestEmailValidation(CHANNELS.OMNI_CARE);
TestEmailValidation(CHANNELS.OMNI_INDIRECT);
TestEmailValidation(CHANNELS.CHAT_STORE);

const receiveCallSagaTesting = (channel,text,longpollMock,windowLocationModification) => {
    const orderReviewKey = 'OrderReview';
    setupChannel(channel)

    describe(`CheckoutInspicio - long polling ${text}`, () => {
        let store, asFragment, component;
        let handlers1 = [
            rest.post(`*/inspicioservice/inspicio/generateInspicioID`, (req, res, ctx) => {
                console.log("generateinspicio");
                return res(ctx.status(200), ctx.json(generateInspicioId_Response),);
            }),
            rest.post(`*/cartservice/cart/retrieve-cart`, (req, res, ctx) => {
                console.log("retrievecart");
                return res(ctx.status(200), ctx.json(retrieveCart_Response),);
            }),
            rest.post("*/inspicioservice/inspicio/sendMessage", (req, res, ctx) => {
                console.log("sendMessage");
                return res(ctx.status(200), ctx.json(sendMessage_Response),);
            }),
            rest.post("*/peripheralsservice/jsNotifyAsDynamic", (req, res, ctx) => {
                console.log("sendMessage");
                return res(ctx.status(200));
            }),
            rest.post("*paymentservice/generateQRCode", (req, res, ctx) => {
                console.log("generateQRCode");
                return res(ctx.status(200), ctx.json(generateInspicioId_Response));
            }),
            rest.post(`*inspicioservice-uat.vzwcorp.com/inspicio/receive`, (req, res, ctx) => {
                return res(ctx.status(200), ctx.json(longpollMock));
            })
           
        ];
        const server1 = setupServer(...handlers1);
        function* rootSaga() {
            yield all([longPollSaga()]);
        }

        beforeAll(() => server1.listen());

        beforeEach(() => {
            let store1 = configureStore(INITIAL_STATE);
              window.store = store1;
              jest.spyOn(console, 'error');
              jest.spyOn(console, 'warn');
              jest.spyOn(window.store, 'getState');
              // @ts-ignore jest.spyOn adds this functionallity
              let newWindow = {
                ...window.lovEmulatorWindow,
                closed:true

              }
              Object.defineProperty(window, 'lovEmulatorWindow', {
                writable: true,
                value: newWindow,
              });
              
              window.store.getState.mockImplementation(() => STATE);
            //   window.lovEmulatorWindow = window.lovEmulatorWindow ? newWindow : jest.fn(()=>false)
            window.lovEmulatorWindow = newWindow 
            const location = {
                ...window.location
              };
              Object.defineProperty(window, 'location', {
                writable: true,
                value: location,
              });
              if(windowLocationModification=="discounts.html"){
                window.location.pathname=windowLocationModification;
              }
              else {
                window.location.href = windowLocationModification;
                window.location.pathname="";
              }
            ({ store, asFragment, ...component } = render(
                <CheckoutInspicio channel="OMNI-TELESALES" pageName="cardinalPayment"  orderNumbers="20041380" agreementEligibleFlags={{}} {...landingProps}/>,
                {
                    reducers:
                    {
                        [orderReviewKey]: orederReviewReducer,
                        [INJECTOR_KEYS.LONG_POLL]: longPollReducer,
                        ['App']: appReducer,
                    },
                    sagas: rootSaga,
                    preloadedState: state
                }
            ))

        });

        test('should trigger IG error', async () => {
            expect(screen.getByTestId("inspicoToggleSwitch")).toBeInTheDocument();
            //adding wait for long polling to run and capture the IG error event
            await wait(5000);
        })

    })
 
}
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "customerIGError", longPollResponseForIGError,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "addressSelected", longPollResponseForIGErroraddressSelected,"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "useWallet", longPollResponseForIGErroruseWallet,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "enableSubmit", longPollResponseForIGErrorenableSubmit,"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "ipAddress", longPollResponseForIGErroripAddress,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "giftPurchaseCheck", longPollResponseForIGErrorgiftPurchaseCheck,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "tacSubmit", longPollResponseForIGErrortacSubmit,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "zipCode", longPollResponse_zipcode,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "expiration", expirationMock,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "number", longPollResponse_number,"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "cvv",{event:"agreementsData", payload: {action:"submitClicked",pageName:"orderReview",value:"repAssistedPayment",nickName:"xyz",field:"cvv"}},"")
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "cvv",{event:"agreementsData", payload: {action:"submitClicked",pageName:"orderReview",value:"repAssistedPayment",field:"cvv"}},"")
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "submit", longPollResponseForIGErrorenableSubmitisLov,"order-review");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "submit", longPollResponseForIGErrorenableSubmitisLov,"payment");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "gcPayment", longPollResponseForgcPayment,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "gcBalanceCheck", longPollResponseForgcBalanceCheck,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "openRepEmulator", openRepEmulatorResp,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "agreementsData", longPollResponse_agreementsData,"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "enableVZDollarSubmit", {"payload":{"action":"enableVZDollarSubmit","amount":"12.00"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "enableVZSubmit", {"payload":{"action":"enableVZSubmit","amount":"12.00"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "enablePaxSubmit", {"payload":{"action":"enablePaxSubmit"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "submitSignature", {"event":"submitSignature",payload:{"tacsignature": "iVBOR"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "lovVzCardCheckbox", {"event":"lovVzCardCheckbox",payload:true},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "submitClicked", longPollResponse_submitClicked,"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "tacsignature", longPollResponseForIGErrortacsignature,"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "mgrApprovalEnableSubmit", longPollResponseForIGErrormgrApprovalEnableSubmit,"discounts.html");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "mgrApprovalEnableSubmit", longPollResponseForIGErrormgrApprovalEnableSubmit,"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "TimeOut", {status:"Timeout",payload:{}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "resendor", {event:"resendor",status:"Success",payload:{event:"resendor"}},"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "customerWindowClose", {payload:{field:"customerWindowClose",value:"customerWindowClose","action":"sessionExpired"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "sessionExpired", {payload:{"action":"sessionExpired"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "vtRefreshPayment", {event:"vtRefreshPayment",payload:{}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "paymentError", {event:"paymentError",payload:{action:"paymentError","msg":"Payment denied","type":"PTA"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "paymentError", {event:"paymentError",payload:{action:"paymentError","msg":"Payment denied","type":""}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "paymentError", {event:"paymentError",payload:{action:"paymentError"}},"");

receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "payAtKioskSelected", {event:"payAtKioskSelected",payload:{action:"payAtKioskSelected","msg":"Payment denied","type":""}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "milestone", {event:"milestone",payload:{}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "resumeordertab", {event:"resumeordertab",payload:{action:"resumeordertab"}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "submitClicked", {event:"submitClicked",payload:{}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "cancelPayment", {event:"cancelPayment",payload:{}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "agreementsData", {"event": "agreementsData",
"payload": {}},"");
receiveCallSagaTesting(CHANNELS.OMNI_TELESALES, "submitSignature", {"event":"submitSignature",payload:{"tacsignature": ""}},"");

const NewTest1 = (channel) => {
    setupChannel(channel)
  
    describe(`function call check - ${channel}`, () => {
      test("it should render", async () => {
        
        let PropsNew = Object.assign({}, checkoutInspicioProps);
        PropsNew.setSentEmailFlag = jest.fn()
        
  
        const CheckoutInspicioObjNewTest = new CheckoutInspicioObj(PropsNew);
        CheckoutInspicioObjNewTest.clearSignature();
        CheckoutInspicioObjNewTest.handleMdnOnChange();
        CheckoutInspicioObjNewTest.callInspicios();
        CheckoutInspicioObjNewTest.handleCustomMtn();
        CheckoutInspicioObjNewTest.sendPaymentError();
        CheckoutInspicioObjNewTest.closeSpanishBanner();
      })
    
    });
   
  }
NewTest1(CHANNELS.OMNI_RETAIL);

import { processReceiveData, getSendEmailRequest, getSendEmailAPIRequest, isPreOrBackOrder, tncPayload } from './Utils';


// Helper function to get the current date in the format used in your function
const getCurrentDate = () => {
    const currentDate = new Date();
    let dd = currentDate.getDate();
    let mm = currentDate.getMonth() + 1;
    const yyyy = currentDate.getFullYear();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;
    return `${mm}/${dd}/${yyyy}`;
};

const formatDate = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) dd = `0${dd}`;
    if (mm < 10) mm = `0${mm}`;
    return `${mm}/${dd}/${yyyy}`;
};

describe('getSendEmailAPIRequest', () => {



    it('should use default userId when not provided in payload', () => {
        const payload = {
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "DEFAULT",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100"
        };

        const result = getSendEmailAPIRequest(payload);

        expect(result.meta.user).toBe("c0huska"); // Default value for userId
    });

    it('should format date correctly and include it in request', () => {
        const payload = {
            userId: "testUser",
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "DEFAULT",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100"
        };

        const result = getSendEmailAPIRequest(payload);

        // Ensure the date matches the formatted date
        expect(result.data.ordInfo.orderDate).toBe(getCurrentDate()); // Check for correct date format
    });

    it('should include default values in the API request', () => {
        const payload = {
            // omitting some fields to test default values
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "DEFAULT",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100"
        };

        const result = getSendEmailAPIRequest(payload);

        expect(result.meta.client).toBe("POSMOBILE");
        expect(result.meta.user).toBe("c0huska"); // Default value
        expect(result.meta.timestamp).toBeDefined(); // Ensure timestamp is present
    });

    it('should handle payload with all fields provided correctly', () => {
        const payload = {
            userId: "testUser",
            pageName: "testPage",
            cluster: "testCluster",
            sms: "Y",
            sendInspicioToken: "testToken",
            channel: "EMAIL",
            tradeIn: "Y",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: true,
            amount: "100",
            cartId: "cart123",
            caseId: "case123",
            firstName: "John",
            emailId: "john.doe@example.com"
        };

        const result = getSendEmailAPIRequest(payload);

        expect(result.data.pageName).toBe("testPage");
        expect(result.data.emailId).toBe("john.doe@example.com");
        expect(result.data.mtn).toBe("1234567890");
        expect(result.data.ordInfo.orderDate).toBe(getCurrentDate());
    });

    it('should format date with day less than 10 correctly', () => {
        const payload = {
            userId: "testUser",
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "DEFAULT",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100"
        };

        // Use a date where the day is less than 10
        const testDate = new Date('2024-09-05'); // 5th day, which is less than 10

        jest.spyOn(global, 'Date').mockImplementation(() => testDate);

        const result = getSendEmailAPIRequest(payload);
        expect(result.data.ordInfo.orderDate).toBe(formatDate(testDate));
    });

    it('should format date with month less than 10 correctly', () => {
        const payload = {
            userId: "testUser",
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "DEFAULT",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100"
        };

        // Use a date where the month is less than 10
        const testDate = new Date('2024-05-15'); // May (5th month), which is less than 10

        jest.spyOn(global, 'Date').mockImplementation(() => testDate);

        const result = getSendEmailAPIRequest(payload);
        expect(result.data.ordInfo.orderDate).toBe(formatDate(testDate));
    });

    it('should format date with day and month both greater than or equal to 10 correctly', () => {
        const payload = {
            userId: "testUser",
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "DEFAULT",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100"
        };

        const testDate = new Date('2024-11-15');

        jest.spyOn(global, 'Date').mockImplementation(() => testDate);

        const result = getSendEmailAPIRequest(payload);
        expect(result.data.ordInfo.orderDate).toBe(formatDate(testDate));
    });
});

describe('Utils Functions', () => {
    // Test for processReceiveData


    const mockisPreOrBackOrder = jest.fn();
    const mockgetSendEmailAPIRequest = jest.fn();


    jest.mock('./Utils', () => {
        const mockoriginalModule = jest.requireActual('./Utils');

        return {
            ...mockoriginalModule,
            getSendEmailAPIRequest: mockgetSendEmailAPIRequest,
            isPreOrBackOrder: mockisPreOrBackOrder,
        };
    });
    describe('getSendEmailRequest', () => {

        beforeEach(() => {
            jest.resetAllMocks();
        });



        it('should set pageName to "networkextender" for OMNI-CARE channel with specific conditions', () => {
            const cart = {
                orderDetails: {
                    orderNumber: "",
                    orderList: [],
                    orderType: "",
                    locationCode: "LOC456",
                    totalDueToday: "200"
                },
                cartHeader: { creditApplicationNum: "" },
                lineDetails: {}
            };

            const payload = {
                selectedMtn: "654321",
                selectedEmailId: "test2@example.com",
                agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: true },
                sendInspicioToken: "testToken",
                receievInspicioToken: "recvToken",
                customerProfileData: { customer: { accountNo: "ACCT456", cartId: "cart2", caseId: "case2", loggedInUser: "user2" } },
                channel: "OMNI-CARE",
                pageName: "tandc",
                inspicioMode: "email",
                sendMessageResponse: { cluster: "cluster2" },
                primaryUserInfo: { firstName: "Jane" },
                whwRedemptionFlow: false,
                midnightRedemptionFlow: false,
                repeaterDeviceSku: "SC-NONCONNECT"
            };

            mockisPreOrBackOrder.mockReturnValue(false);
            mockgetSendEmailAPIRequest.mockReturnValue({});

            const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
                payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
                payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
                payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

            expect(result.data.pageName).toBe("networkextender");
        });

        it('should set pageName to "repeaterdevice" for OMNI-CARE channel with specific SKU', () => {
            const cart = {
                orderDetails: {
                    orderNumber: "",
                    orderList: [],
                    orderType: "",
                    locationCode: "LOC789",
                    totalDueToday: "300"
                },
                cartHeader: { creditApplicationNum: "" },
                lineDetails: {}
            };

            const payload = {
                selectedMtn: "789012",
                selectedEmailId: "test3@example.com",
                agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
                sendInspicioToken: "testToken",
                receievInspicioToken: "recvToken",
                customerProfileData: { customer: { accountNo: "ACCT789", cartId: "cart3", caseId: "case3", loggedInUser: "user3" } },
                channel: "OMNI-CARE",
                pageName: "testPage",
                inspicioMode: "email",
                sendMessageResponse: { cluster: "cluster3" },
                primaryUserInfo: { firstName: "Bob" },
                whwRedemptionFlow: false,
                midnightRedemptionFlow: false,
                repeaterDeviceSku: "SC-EZCONNECT"
            };

            mockisPreOrBackOrder.mockReturnValue(false);
            mockgetSendEmailAPIRequest.mockReturnValue({});

            const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
                payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
                payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
                payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

            expect(result.data.pageName).toBe("repeaterdevice");
        });

        it('should handle default userId when not provided', () => {
            const cart = {
                orderDetails: {
                    orderNumber: "",
                    orderList: [],
                    orderType: "",
                    locationCode: "LOC000",
                    totalDueToday: "100"
                },
                cartHeader: { creditApplicationNum: "" },
                lineDetails: {}
            };

            const payload = {
                selectedMtn: "345678",
                selectedEmailId: "test4@example.com",
                agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
                sendInspicioToken: "testToken",
                receievInspicioToken: "recvToken",
                customerProfileData: { customer: { accountNo: "ACCT000", cartId: "cart5", caseId: "case5", loggedInUser: "" } },
                channel: "DEFAULT",
                pageName: "testPage",
                inspicioMode: "email",
                sendMessageResponse: { cluster: "cluster5" },
                primaryUserInfo: { firstName: "Charlie" },
                whwRedemptionFlow: false,
                midnightRedemptionFlow: false,
                repeaterDeviceSku: "SC-NONCONNECT"
            };

            mockisPreOrBackOrder.mockReturnValue(false);
            mockgetSendEmailAPIRequest.mockReturnValue({});

            const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
                payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
                payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
                payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

            expect(result.data.pageName).toBe("testPage");
        });

        it('should handle all edge cases correctly', () => {
            const cart = {
                orderDetails: {
                    orderNumber: "",
                    orderList: [
                        { orderNumber: "0000", creditApplication: { creditApplicationNum: "CRED0000" } }
                    ],
                    orderType: "IS",
                    locationCode: "LOC111",
                    totalDueToday: "350"
                },
                cartHeader: { creditApplicationNum: "" },
                lineDetails: { tradeInDetail: { tradeInItems: [{}] } }
            };

            const payload = {
                selectedMtn: "987654",
                selectedEmailId: "test5@example.com",
                agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: true },
                sendInspicioToken: "testToken",
                receievInspicioToken: "recvToken",
                customerProfileData: { customer: { accountNo: "ACCT111", cartId: "cart6", caseId: "case6", loggedInUser: "user6" } },
                channel: "OMNI-CARE",
                pageName: "tandc",
                inspicioMode: "email",
                sendMessageResponse: { cluster: "cluster6" },
                primaryUserInfo: { firstName: "David" },
                whwRedemptionFlow: false,
                midnightRedemptionFlow: false,
                repeaterDeviceSku: "SC-NONCONNECT"
            };

            mockisPreOrBackOrder.mockReturnValue(true);
            mockgetSendEmailAPIRequest.mockReturnValue({});

            const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
                payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
                payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
                payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

            expect(result.data.pageName).toBe("networkextender");
        });

        afterAll(() => {
            jest.resetAllMocks();
        })
    });

    describe('processReceiveData function', () => {
        it('should return ipAddress when field is ipAddress', () => {
            const longPollEvent = "";
            const longPollPayload = { field: "ipAddress", value: "192.168.1.1" };
            const result = processReceiveData(longPollEvent, longPollPayload);
            expect(result).toEqual({ ipAddress: "192.168.1.1" });
        });

        it('should return an object with tacsignature when longPollEvent is submitSignature and tacsignature is present', () => {
            const longPollEvent = "submitSignature";
            const longPollPayload = { tacsignature: "base64encodedstring" };
            const result = processReceiveData(longPollEvent, longPollPayload);
            expect(result).toEqual({
                tacsignature: "data:image/png;base64,base64encodedstring"
            });
        });

        it('should return an object with safetechSessionId when longPollEvent is submitSignature and safetechSessionId is present', () => {
            const longPollEvent = "submitSignature";
            const longPollPayload = { safetechSessionId: "sessionId123" };
            const result = processReceiveData(longPollEvent, longPollPayload);
            expect(result).toEqual({ safetechSessionId: "sessionId123" });
        });

        it('should return an object with both tacsignature and safetechSessionId when both are present', () => {
            const longPollEvent = "submitSignature";
            const longPollPayload = {
                tacsignature: "base64encodedstring",
                safetechSessionId: "sessionId123"
            };
            const result = processReceiveData(longPollEvent, longPollPayload);
            expect(result).toEqual({
                tacsignature: "data:image/png;base64,base64encodedstring",
                safetechSessionId: "sessionId123"
            });
        });

        it('should return an empty object for longPollEvent submitSignature with no relevant fields', () => {
            const longPollEvent = "submitSignature";
            const longPollPayload = {};
            const result = processReceiveData(longPollEvent, longPollPayload);
            expect(result).toEqual({});
        });

        it('should return an empty object for unknown longPollEvent and payload', () => {
            const longPollEvent = "unknownEvent";
            const longPollPayload = {};
            const result = processReceiveData(longPollEvent, longPollPayload);
            expect(result).toEqual({});
        });

        it('should handle undefined payload gracefully', () => {
            const longPollEvent = "submitSignature";
            const result = processReceiveData(longPollEvent, undefined);
            expect(result).toEqual({});
        });
    });





    describe('isPreOrBackOrder', () => {
        it('should return false if cartDetails is null', () => {
            expect(isPreOrBackOrder(null)).toBe(false);
        });

        it('should return false if lineDetails or lineInfo is missing', () => {
            expect(isPreOrBackOrder({ lineDetails: {} })).toBe(false);
            expect(isPreOrBackOrder({ lineDetails: { lineInfo: null } })).toBe(false);
        });

        it('should return true if inventory has isBackorder set to true', () => {
            const cartDetails = {
                lineDetails: {
                    lineInfo: [
                        {
                            itemsInfo: [
                                {
                                    cartItems: {
                                        cartItem: [
                                            { inventory: { isBackorder: true } }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            };
            expect(isPreOrBackOrder(cartDetails)).toBe(true);
        });

        it('should return true if inventory has isPreOrder set to true', () => {
            const cartDetails = {
                lineDetails: {
                    lineInfo: [
                        {
                            itemsInfo: [
                                {
                                    cartItems: {
                                        cartItem: [
                                            { inventory: { isPreOrder: true } }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            };
            expect(isPreOrBackOrder(cartDetails)).toBe(true);
        });

        it('should return false if no inventory flags are set', () => {
            const cartDetails = {
                lineDetails: {
                    lineInfo: [
                        {
                            itemsInfo: [
                                {
                                    cartItems: {
                                        cartItem: [
                                            { inventory: {} }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            };
            expect(isPreOrBackOrder(cartDetails)).toBe(false);
        });
    });




    // Mock internal functions
    const mockGetAALAgreementNo = jest.fn();
    const mockGetEUPAgreementNo = jest.fn();
    const mockGetBackupPaymentFlagForAgreement = jest.fn();
    const mockPopulateTysPayloadParams = jest.fn();

    jest.mock('./Utils', () => {
        const mockoriginalModule = jest.requireActual('./Utils');

        return {
            ...mockoriginalModule,
            getAALAgreementNo: mockGetAALAgreementNo,
            getEUPAgreementNo: mockGetEUPAgreementNo,
            getBackupPaymentFlagForAgreement: mockGetBackupPaymentFlagForAgreement,
            populateTysPayloadParams: mockPopulateTysPayloadParams,
        };
    });






    describe('tncPayload function', () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });



        it('should return payload with default values when no special conditions are met', () => {
            const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = {};
            const encryptedCartId = "cart123";
            const channel = "DEFAULT";
            const orderBalance = "100";
            const repeaterDeviceSku = "SC-XYZ";
            const isMultiLineRisaEnabled = false;
            const orderPaymentDetails = {};
            const whwRedemptionFlow = false;
            const midnightRedemptionFlow = false;
            const customerDetails = {};
            const isTysFlow = false;

            const mockBackupPaymentFlag = 'backupFlag';
            mockGetBackupPaymentFlagForAgreement.mockReturnValue(mockBackupPaymentFlag);

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(result).toEqual({
                encryptedCartId,
                isMultiLineRisaEnabled,
                pageName: "tandc",
                locationCode: "001",
                fcraEnabled: "Y",
                upgradeAgreementNo: undefined,
                aalAgreementNo: undefined,
                upgradeTwoYear: "N",
                aalTwoYear: "N",
                eqpDeclined: "N",
                showEquipmentProtection: "N",
                retailPrice: "100",
                channel: "DEFAULT",
                backupPaymentFlag: 'N',
                creditAppNumber: "",
                ringType: "N",
                orderType: "M",
                homeMobileCombo: "N"
            });
        });

        it('should call getAALAgreementNo and getEUPAgreementNo', () => {
            const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = { showLTEAgreement: false, show5GAgreement: false };
            const encryptedCartId = "cart123";
            const channel = "DEFAULT";
            const orderBalance = "100";
            const repeaterDeviceSku = "SC-XYZ";
            const isMultiLineRisaEnabled = true;  // To trigger AAL and EUP agreements
            const orderPaymentDetails = {};
            const whwRedemptionFlow = false;
            const midnightRedemptionFlow = false;
            const customerDetails = {};
            const isTysFlow = false;

            const aalAgreement = { aalAgreementNum: "AAL123", aalMtnInstallmentString: "AAL456" };
            const eupAgreement = { eupAgreementNum: "EUP123", eupMtnInstallmentString: "EUP456" };
            mockGetAALAgreementNo.mockReturnValue(aalAgreement);
            mockGetEUPAgreementNo.mockReturnValue(eupAgreement);

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(mockGetAALAgreementNo).toHaveBeenCalled();
            expect(mockGetEUPAgreementNo).toHaveBeenCalled();
            expect(result.upgradeAgreementNo).toBe(aalAgreement.aalMtnInstallmentString);
            expect(result.aalAgreementNo).toBe(aalAgreement.aalAgreementNum);
        });

        it('should handle showLTEAgreement and show5GAgreement flags', () => {
            const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = { showLTEAgreement: true, show5GAgreement: false };
            const encryptedCartId = "cart123";
            const channel = "DEFAULT";
            const orderBalance = "100";
            const repeaterDeviceSku = "SC-XYZ";
            const isMultiLineRisaEnabled = false;
            const orderPaymentDetails = {};
            const whwRedemptionFlow = false;
            const midnightRedemptionFlow = false;
            const customerDetails = {};
            const isTysFlow = false;

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(result.fiveGInd).toBe("ltehome");
        });

        it('should handle show5GAgreement flag', () => {
            const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = { showLTEAgreement: false, show5GAgreement: true };
            const encryptedCartId = "cart123";
            const channel = "DEFAULT";
            const orderBalance = "100";
            const repeaterDeviceSku = "SC-XYZ";
            const isMultiLineRisaEnabled = false;
            const orderPaymentDetails = {};
            const whwRedemptionFlow = false;
            const midnightRedemptionFlow = false;
            const customerDetails = {};
            const isTysFlow = false;

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(result.fiveGInd).toBe("fiveg");
        });

        it('should handle repeaterDeviceSku condition', () => {
            const cart = { orderDetails: { totalDueToday: "0", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = {};
            const encryptedCartId = "cart123";
            const channel = "OMNI-CARE";
            const orderBalance = "0";
            const repeaterDeviceSku = "SC-EZCONNECT";
            const isMultiLineRisaEnabled = false;
            const orderPaymentDetails = {};
            const whwRedemptionFlow = false;
            const midnightRedemptionFlow = false;
            const customerDetails = {};
            const isTysFlow = false;

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(result.repeaterDevice).toBe("Y");
        });

        it('should handle whwRedemptionFlow and midnightRedemptionFlow', () => {
            const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = {};
            const encryptedCartId = "cart123";
            const channel = "DEFAULT";
            const orderBalance = "100";
            const repeaterDeviceSku = "SC-XYZ";
            const isMultiLineRisaEnabled = false;
            const orderPaymentDetails = {};
            const whwRedemptionFlow = true;
            const midnightRedemptionFlow = true;
            const customerDetails = {};
            const isTysFlow = false;

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(result.fiveGWHWFlow).toBe("Y");
            expect(result.midnightWHWRedeem).toBe("Y");
            expect(result.fiveGInd).toBe("fiveg");
        });

        it('should handle isTysFlow and call populateTysPayloadParams', () => {
            const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
            const agreementEligibleFlags = {};
            const encryptedCartId = "cart123";
            const channel = "DEFAULT";
            const orderBalance = "100";
            const repeaterDeviceSku = "SC-XYZ";
            const isMultiLineRisaEnabled = false;
            const orderPaymentDetails = {};
            const whwRedemptionFlow = false;
            const midnightRedemptionFlow = false;
            const customerDetails = {};
            const isTysFlow = true;

            mockPopulateTysPayloadParams.mockReturnValue({
                tysParam1: "value1",
                tysParam2: "value2"
            });

            const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

            expect(mockPopulateTysPayloadParams).toHaveBeenCalledWith(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
                isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails);
            expect(result.tysParams).toEqual({
                tysParam1: "value1",
                tysParam2: "value2"
            });
        });
    });



    it('should set retailPrice based on lineActivityType "EUP" and "AAL"', () => {
        const cart = {
            orderDetails: { totalDueToday: "100" },
            lineDetails: {
                lineInfo: [
                    {
                        lineActivityType: "EUP",
                        itemsInfo: [
                            {
                                cartItems: {
                                    cartItem: [
                                        { cartItemType: "DEVICE", itemPrice: "150" }
                                    ]
                                }
                            }
                        ]
                    },
                    {
                        lineActivityType: "AAL",
                        itemsInfo: [
                            {
                                cartItems: {
                                    cartItem: [
                                        { cartItemType: "DEVICE", itemPrice: "200" }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        };
        const agreementEligibleFlags = {};
        const encryptedCartId = "cart123";
        const channel = "DEFAULT";
        const orderBalance = "100";
        const repeaterDeviceSku = "SC-XYZ";
        const isMultiLineRisaEnabled = false;
        const orderPaymentDetails = {};
        const whwRedemptionFlow = false;
        const midnightRedemptionFlow = false;
        const customerDetails = {};
        const isTysFlow = false;

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(result.retailPrice).toBe("150");
    });

    it('should set retailPrice based on DEVICE type and correctly iterate through itemsInfo', () => {
        const cart = {
            orderDetails: { totalDueToday: "100" },
            lineDetails: {
                lineInfo: [
                    {
                        lineActivityType: "EUP",
                        itemsInfo: [
                            {
                                cartItems: {
                                    cartItem: [
                                        { cartItemType: "ACCESSORY", itemPrice: "120" },
                                        { cartItemType: "DEVICE", itemPrice: "250" }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        };
        const agreementEligibleFlags = {};
        const encryptedCartId = "cart123";
        const channel = "DEFAULT";
        const orderBalance = "100";
        const repeaterDeviceSku = "SC-XYZ";
        const isMultiLineRisaEnabled = false;
        const orderPaymentDetails = {};
        const whwRedemptionFlow = false;
        const midnightRedemptionFlow = false;
        const customerDetails = {};
        const isTysFlow = false;

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(result.retailPrice).toBe("250"); // Should be updated to DEVICE type itemPrice
    });

    it('should handle case where no items match the criteria', () => {
        const cart = {
            orderDetails: { totalDueToday: "100" },
            lineDetails: {
                lineInfo: [
                    {
                        lineActivityType: "EUP",
                        itemsInfo: [
                            {
                                cartItems: {
                                    cartItem: [
                                        { cartItemType: "ACCESSORY", itemPrice: "120" }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        };
        const agreementEligibleFlags = {};
        const encryptedCartId = "cart123";
        const channel = "DEFAULT";
        const orderBalance = "100";
        const repeaterDeviceSku = "SC-XYZ";
        const isMultiLineRisaEnabled = false;
        const orderPaymentDetails = {};
        const whwRedemptionFlow = false;
        const midnightRedemptionFlow = false;
        const customerDetails = {};
        const isTysFlow = false;

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(result.retailPrice).toBe("100"); // Default value should be preserved
    });


});

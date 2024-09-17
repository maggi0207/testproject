import { getSendEmailRequest } from './YourModule';
import { isPreOrBackOrder, getSendEmailAPIRequest } from './Utils';

jest.mock('./Utils', () => {
    const originalModule = jest.requireActual('./Utils');
    return {
        ...originalModule,
        getSendEmailAPIRequest: jest.fn(),
        isPreOrBackOrder: jest.fn(),
    };
});

describe('getSendEmailRequest', () => {
    const mockIsPreOrBackOrder = isPreOrBackOrder;
    const mockGetSendEmailAPIRequest = getSendEmailAPIRequest;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    // Existing test cases...

    it('should handle undefined pageName in payload', () => {
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
            selectedEmailId: "test6@example.com",
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT000", cartId: "cart5", caseId: "case5", loggedInUser: "user" } },
            channel: "DEFAULT",
            pageName: undefined,
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster5" },
            primaryUserInfo: { firstName: "Charlie" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        mockIsPreOrBackOrder.mockReturnValue(false);
        mockGetSendEmailAPIRequest.mockReturnValue({ data: { pageName: "defaultPage" } });

        const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(mockGetSendEmailAPIRequest).toHaveBeenCalledWith(expect.objectContaining({ pageName: "defaultPage" }));
        expect(result.data.pageName).toBe("defaultPage");
    });

    it('should handle null values for important parameters', () => {
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
            selectedMtn: null,
            selectedEmailId: null,
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: null,
            receievInspicioToken: null,
            customerProfileData: { customer: { accountNo: "ACCT000", cartId: "cart5", caseId: "case5", loggedInUser: "user" } },
            channel: "DEFAULT",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster5" },
            primaryUserInfo: { firstName: "Charlie" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        mockIsPreOrBackOrder.mockReturnValue(false);
        mockGetSendEmailAPIRequest.mockReturnValue({ data: { pageName: "testPage" } });

        const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(mockGetSendEmailAPIRequest).toHaveBeenCalledWith(expect.objectContaining({ pageName: "testPage" }));
        expect(result.data.pageName).toBe("testPage");
    });

    it('should test behavior with different return values from isPreOrBackOrder', () => {
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
            selectedEmailId: "test7@example.com",
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT000", cartId: "cart5", caseId: "case5", loggedInUser: "user" } },
            channel: "OMNI-CARE",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster5" },
            primaryUserInfo: { firstName: "Charlie" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        // Test when isPreOrBackOrder returns true
        mockIsPreOrBackOrder.mockReturnValue(true);
        mockGetSendEmailAPIRequest.mockReturnValue({ data: { pageName: "networkextender" } });

        let result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);
        
        expect(result.data.pageName).toBe("networkextender");

        // Test when isPreOrBackOrder returns false
        mockIsPreOrBackOrder.mockReturnValue(false);
        mockGetSendEmailAPIRequest.mockReturnValue({ data: { pageName: "testPage" } });

        result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);
        
        expect(result.data.pageName).toBe("testPage");
    });

    it('should handle API request returning no data', () => {
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
            selectedEmailId: "test8@example.com",
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT000", cartId: "cart5", caseId: "case5", loggedInUser: "user" } },
            channel: "DEFAULT",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster5" },
            primaryUserInfo: { firstName: "Charlie" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        mockIsPreOrBackOrder.mockReturnValue(false);
        mockGetSendEmailAPIRequest.mockReturnValue({ data: {} }); // No data

        const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(result.data.pageName).toBeUndefined();
    });

    it('should assign correct pageName for different channels', () => {
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
            selectedEmailId: "test9@example.com",
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT000", cartId: "cart5", caseId: "case5", loggedInUser: "user" } },
            channel: "OMNI-CARE",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster5" },
            primaryUserInfo: { firstName: "Charlie" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        mockIsPreOrBackOrder.mockReturnValue(false);
        mockGetSendEmailAPIRequest.mockReturnValue({ data: { pageName: "omniPage" } });

        const result = getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(result.data.pageName).toBe("omniPage");
    });
});

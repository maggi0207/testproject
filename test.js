import { getSendEmailRequest, getSendEmailAPIRequest } from './yourModule';
import { isPreOrBackOrder } from './yourModule'; // Import necessary helper functions

jest.mock('./Utils', () => ({
    ...jest.requireActual('./Utils'),
    getSendEmailAPIRequest: jest.fn(),
    isPreOrBackOrder: jest.fn(),
}));

describe('getSendEmailRequest', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should handle orderNumber and creditApplicationNum correctly', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [
                    { orderNumber: "1234", orderActivityType: "ACC" }
                ],
                orderType: "IS",
                locationCode: "LOC123",
                totalDueToday: "150"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "123456",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT123", cartId: "cart1", caseId: "case1", loggedInUser: "user1" } },
            channel: "DEFAULT",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster1" },
            primaryUserInfo: { firstName: "John" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        isPreOrBackOrder.mockReturnValue(false);
        getSendEmailAPIRequest.mockReturnValue({});

        const result = getSendEmailRequest(payload);

        expect(result).toHaveProperty('data.ordInfo.orderNumber', '1234');
        expect(result).toHaveProperty('data.ordInfo.creditAppNumber', '');
    });

    it('should handle date formatting when day and month are both less than 10', () => {
        // Implement test for date formatting with day < 10 and month < 10 if required
    });

    it('should handle empty orderNumber and creditApplicationNum and fallback to orderList', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [
                    { orderNumber: "5678", creditApplication: { creditApplicationNum: "CRED5678" } }
                ],
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
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: false },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT456", cartId: "cart2", caseId: "case2", loggedInUser: "user2" } },
            channel: "DEFAULT",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster2" },
            primaryUserInfo: { firstName: "Jane" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        isPreOrBackOrder.mockReturnValue(true);
        getSendEmailAPIRequest.mockReturnValue({});

        const result = getSendEmailRequest(payload);

        expect(result).toHaveProperty('data.ordInfo.orderNumber', '5678');
        expect(result).toHaveProperty('data.ordInfo.creditAppNumber', 'CRED5678');
    });

    it('should set pageName to "networkextender" for OMNI-CARE channel with specific conditions', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [],
                orderType: "",
                locationCode: "LOC789",
                totalDueToday: "250"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "123456",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: { showNetworkExtenderTnCDiscountApplied: true },
            sendInspicioToken: "testToken",
            receievInspicioToken: "recvToken",
            customerProfileData: { customer: { accountNo: "ACCT789", cartId: "cart3", caseId: "case3", loggedInUser: "user3" } },
            channel: "OMNI-CARE",
            pageName: "tandc",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster3" },
            primaryUserInfo: { firstName: "Alice" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-NONCONNECT"
        };

        isPreOrBackOrder.mockReturnValue(false);
        getSendEmailAPIRequest.mockReturnValue({});

        const result = getSendEmailRequest(payload);

        expect(result.data.pageName).toBe("networkextender");
    });

    it('should set pageName to "repeaterdevice" for OMNI-CARE channel with specific SKU', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [],
                orderType: "",
                locationCode: "LOC999",
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
            customerProfileData: { customer: { accountNo: "ACCT999", cartId: "cart4", caseId: "case4", loggedInUser: "user4" } },
            channel: "OMNI-CARE",
            pageName: "testPage",
            inspicioMode: "email",
            sendMessageResponse: { cluster: "cluster4" },
            primaryUserInfo: { firstName: "Bob" },
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-EZCONNECT"
        };

        isPreOrBackOrder.mockReturnValue(false);
        getSendEmailAPIRequest.mockReturnValue({});

        const result = getSendEmailRequest(payload);

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

        isPreOrBackOrder.mockReturnValue(false);
        getSendEmailAPIRequest.mockReturnValue({});

        const result = getSendEmailRequest(payload);

        expect(result.data.userId).toBe("c0huska");
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
            repeaterDeviceSku: "SC-EZCONNECT"
        };

        isPreOrBackOrder.mockReturnValue(true);
        getSendEmailAPIRequest.mockReturnValue({});

        const result = getSendEmailRequest(payload);

        expect(result.data.pageName).toBe("networkextender");
        expect(result.data.userId).toBe("user6");
    });
});

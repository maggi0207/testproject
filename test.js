

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

describe('getSendEmailAPIRequest', () => {
    it('should return correct API request with default values', () => {
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

        expect(result.meta.client).toBe("POSMOBILE");
        expect(result.data.pageName).toBe("testPage");
        expect(result.data.sms).toBe("N");
        expect(result.data.inspicioToken).toBe(btoa("testToken"));
        expect(result.data.channel).toBe("DEFAULT");
        expect(result.data.ordInfo.orderNumber).toBe("12345");
        expect(result.data.ordInfo.amount).toBe("100");
        expect(result.data.ordInfo.orderDate).toBe(getCurrentDate()); // Date format check
    });

    it('should include orderDate, firstName, and emailAddress for non-CHAT-STORE channel', () => {
        const payload = {
            userId: "testUser",
            pageName: "testPage",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "EMAIL",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100",
            cartId: "cart123",
            caseId: "case123",
            firstName: "John",
            emailId: "john.doe@example.com"
        };

        const result = getSendEmailAPIRequest(payload);

        expect(result.data.ordInfo.orderDate).toBe(getCurrentDate()); // Date format check
        expect(result.data.firstName).toBe("John");
        expect(result.data.emailAddress).toBe("john.doe@example.com");
    });

    it('should handle different pageName and channel values correctly', () => {
        const payload = {
            userId: "testUser",
            pageName: "tandc",
            cluster: "testCluster",
            sms: "N",
            sendInspicioToken: "testToken",
            channel: "OMNI-CARE",
            tradeIn: "N",
            orderNum: "12345",
            locationCode: "LOC123",
            creditAppNumber: "CRED123",
            isPreOrBackOrder: false,
            amount: "100",
            cartId: "cart123",
            caseId: "case123",
            firstName: "John",
            emailId: "john.doe@example.com",
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SC-EZCONNECT"
        };

        const result = getSendEmailAPIRequest(payload);

        expect(result.data.pageName).toBe("repeaterdevice"); // Check for specific condition
    });
});

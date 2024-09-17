

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
});

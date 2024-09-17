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

        // Use a date where both day and month are greater than 10
        const testDate = new Date('2024-11-15'); // 15th day, 11th month

        jest.spyOn(global, 'Date').mockImplementation(() => testDate);

        const result = getSendEmailAPIRequest(payload);
        expect(result.data.ordInfo.orderDate).toBe(formatDate(testDate));
    });

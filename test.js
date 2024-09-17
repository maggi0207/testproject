
    it('should handle case where orderNumber is empty, orderList is non-empty, and orderType is "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" }
                ],
                orderType: "IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "Mtn001",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: {},
            sendInspicioToken: "token1",
            receievInspicioToken: "token2",
            customerProfileData: {},
            channel: "web",
            pageName: "home",
            inspicioMode: "mode1",
            sendMessageResponse: {},
            primaryUserInfo: {},
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SKU123"
        };

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(cart.orderDetails.orderNumber).toBe("67890");
    });

    it('should handle case where orderNumber is empty, orderList is non-empty, and orderType is not "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" }
                ],
                orderType: "NON_IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "Mtn001",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: {},
            sendInspicioToken: "token1",
            receievInspicioToken: "token2",
            customerProfileData: {},
            channel: "web",
            pageName: "home",
            inspicioMode: "mode1",
            sendMessageResponse: {},
            primaryUserInfo: {},
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SKU123"
        };

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(cart.orderDetails.orderNumber).toBe("");
    });

    it('should handle case where orderNumber is zero, orderList is non-empty, and orderType is "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: 0,
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" }
                ],
                orderType: "IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "Mtn001",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: {},
            sendInspicioToken: "token1",
            receievInspicioToken: "token2",
            customerProfileData: {},
            channel: "web",
            pageName: "home",
            inspicioMode: "mode1",
            sendMessageResponse: {},
            primaryUserInfo: {},
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SKU123"
        };

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(cart.orderDetails.orderNumber).toBe("67890");
    });

    it('should handle case where orderNumber is zero, orderList is non-empty, and orderType is not "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: 0,
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" }
                ],
                orderType: "NON_IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "Mtn001",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: {},
            sendInspicioToken: "token1",
            receievInspicioToken: "token2",
            customerProfileData: {},
            channel: "web",
            pageName: "home",
            inspicioMode: "mode1",
            sendMessageResponse: {},
            primaryUserInfo: {},
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SKU123"
        };

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        expect(cart.orderDetails.orderNumber).toBe(0);
    });

    it('should handle case where orderNumber is empty, orderList is empty, and orderType is "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [],
                orderType: "IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "Mtn001",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: {},
            sendInspicioToken: "token1",
            receievInspicioToken: "token2",
            customerProfileData: {},
            channel: "web",
            pageName: "home",
            inspicioMode: "mode1",
            sendMessageResponse: {},
            primaryUserInfo: {},
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SKU123"
        };

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        // Expect orderNumber to remain unchanged as orderList is empty
        expect(cart.orderDetails.orderNumber).toBe("");
    });

    it('should handle case where orderNumber is zero, orderList is empty, and orderType is "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: 0,
                orderList: [],
                orderType: "IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "Mtn001",
            selectedEmailId: "test@example.com",
            agreementEligibleFlags: {},
            sendInspicioToken: "token1",
            receievInspicioToken: "token2",
            customerProfileData: {},
            channel: "web",
            pageName: "home",
            inspicioMode: "mode1",
            sendMessageResponse: {},
            primaryUserInfo: {},
            whwRedemptionFlow: false,
            midnightRedemptionFlow: false,
            repeaterDeviceSku: "SKU123"
        };

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        // Expect orderNumber to remain unchanged as orderList is empty
        expect(cart.orderDetails.orderNumber).toBe(0);
    });
});

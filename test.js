

    it('should handle case where orderNumber is empty, orderList contains ACC type orders, and orderType is "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" },
                    { orderActivityType: "DEL", orderNumber: "12345" }
                ],
                orderType: "IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "345678",
            selectedEmailId: "test1@example.com",
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

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        // Expect orderNumber to be updated with "67890" from ACC type order
        expect(cart.orderDetails.orderNumber).toBe("67890");
    });

    it('should handle case where orderNumber is empty, orderList contains ACC type orders, and orderType is not "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: "",
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" },
                    { orderActivityType: "DEL", orderNumber: "12345" }
                ],
                orderType: "NON_IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "345678",
            selectedEmailId: "test2@example.com",
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

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        // Expect orderNumber to remain unchanged as orderType is not "IS"
        expect(cart.orderDetails.orderNumber).toBe("");
    });

    it('should handle case where orderNumber is zero, orderList contains ACC type orders, and orderType is "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: 0,
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" },
                    { orderActivityType: "DEL", orderNumber: "12345" }
                ],
                orderType: "IS",
                locationCode: "LOC000",
                totalDueToday: "100"
            },
            cartHeader: { creditApplicationNum: "" },
            lineDetails: {}
        };

        const payload = {
            selectedMtn: "345678",
            selectedEmailId: "test3@example.com",
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

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        // Expect orderNumber to be updated with "67890" from ACC type order
        expect(cart.orderDetails.orderNumber).toBe("67890");
    });

    it('should handle case where orderNumber is zero, orderList contains ACC type orders, and orderType is not "IS"', () => {
        const cart = {
            orderDetails: {
                orderNumber: 0,
                orderList: [
                    { orderActivityType: "ACC", orderNumber: "67890" },
                    { orderActivityType: "DEL", orderNumber: "12345" }
                ],
                orderType: "NON_IS",
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

        getSendEmailRequest(cart, payload.selectedMtn, payload.selectedEmailId, payload.agreementEligibleFlags,
            payload.sendInspicioToken, payload.receievInspicioToken, payload.customerProfileData, payload.channel,
            payload.pageName, payload.inspicioMode, payload.sendMessageResponse, payload.primaryUserInfo,
            payload.whwRedemptionFlow, payload.midnightRedemptionFlow, payload.repeaterDeviceSku);

        // Expect orderNumber to remain unchanged as orderType is not "IS"
        expect(cart.orderDetails.orderNumber).toBe(0);
    });
});

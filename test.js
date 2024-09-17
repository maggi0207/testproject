

    it('should set retailPrice based on lineActivityType "EUP"', () => {
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

    it('should set retailPrice based on lineActivityType "AAL"', () => {
        const cart = {
            orderDetails: { totalDueToday: "100" },
            lineDetails: {
                lineInfo: [
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

        expect(result.retailPrice).toBe("200");
    });

    it('should handle empty itemsInfo array', () => {
        const cart = {
            orderDetails: { totalDueToday: "100" },
            lineDetails: {
                lineInfo: [
                    {
                        lineActivityType: "EUP",
                        itemsInfo: []
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

    it('should update retailPrice with DEVICE type item', () => {
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

        expect(result.retailPrice).toBe("250"); // Should update to DEVICE type itemPrice
    });
});

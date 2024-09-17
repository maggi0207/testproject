

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

        expect(result.retailPrice).toBe("200"); // Should be updated to the highest DEVICE itemPrice
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

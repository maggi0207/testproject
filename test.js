

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



describe('tncPayload function', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should return payload with default values when no special conditions are met', () => {
        const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
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

        const mockBackupPaymentFlag = 'backupFlag';
        mockGetBackupPaymentFlagForAgreement.mockReturnValue(mockBackupPaymentFlag);

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(result).toEqual({
            encryptedCartId,
            isMultiLineRisaEnabled,
            pageName: "tandc",
            locationCode: "001",
            fcraEnabled: "Y",
            upgradeAgreementNo: "",
            aalAgreementNo: "",
            upgradeTwoYear: "N",
            aalTwoYear: "N",
            eqpDeclined: "N",
            showEquipmentProtection: "N",
            retailPrice: "100",
            channel: "DEFAULT",
            backupPaymentFlag: mockBackupPaymentFlag,
            creditAppNumber: "",
            ringType: "N",
            orderType: "M",
            homeMobileCombo: "N"
        });
    });

    it('should call getAALAgreementNo and getEUPAgreementNo', () => {
        const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
        const agreementEligibleFlags = { showLTEAgreement: false, show5GAgreement: false };
        const encryptedCartId = "cart123";
        const channel = "DEFAULT";
        const orderBalance = "100";
        const repeaterDeviceSku = "SC-XYZ";
        const isMultiLineRisaEnabled = true;  // To trigger AAL and EUP agreements
        const orderPaymentDetails = {};
        const whwRedemptionFlow = false;
        const midnightRedemptionFlow = false;
        const customerDetails = {};
        const isTysFlow = false;

        const aalAgreement = { aalAgreementNum: "AAL123", aalMtnInstallmentString: "AAL456" };
        const eupAgreement = { eupAgreementNum: "EUP123", eupMtnInstallmentString: "EUP456" };
        mockGetAALAgreementNo.mockReturnValue(aalAgreement);
        mockGetEUPAgreementNo.mockReturnValue(eupAgreement);

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(mockGetAALAgreementNo).toHaveBeenCalled();
        expect(mockGetEUPAgreementNo).toHaveBeenCalled();
        expect(result.upgradeAgreementNo).toBe(aalAgreement.aalMtnInstallmentString);
        expect(result.aalAgreementNo).toBe(aalAgreement.aalAgreementNum);
    });

    it('should handle showLTEAgreement and show5GAgreement flags', () => {
        const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
        const agreementEligibleFlags = { showLTEAgreement: true, show5GAgreement: false };
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

        expect(result.fiveGInd).toBe("ltehome");
    });

    it('should handle show5GAgreement flag', () => {
        const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
        const agreementEligibleFlags = { showLTEAgreement: false, show5GAgreement: true };
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

        expect(result.fiveGInd).toBe("fiveg");
    });

    it('should handle repeaterDeviceSku condition', () => {
        const cart = { orderDetails: { totalDueToday: "0", locationCode: "001", isComboOrder: "N" } };
        const agreementEligibleFlags = {};
        const encryptedCartId = "cart123";
        const channel = "OMNI-CARE";
        const orderBalance = "0";
        const repeaterDeviceSku = "SC-EZCONNECT";
        const isMultiLineRisaEnabled = false;
        const orderPaymentDetails = {};
        const whwRedemptionFlow = false;
        const midnightRedemptionFlow = false;
        const customerDetails = {};
        const isTysFlow = false;

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(result.repeaterDevice).toBe("Y");
    });

    it('should handle whwRedemptionFlow and midnightRedemptionFlow', () => {
        const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
        const agreementEligibleFlags = {};
        const encryptedCartId = "cart123";
        const channel = "DEFAULT";
        const orderBalance = "100";
        const repeaterDeviceSku = "SC-XYZ";
        const isMultiLineRisaEnabled = false;
        const orderPaymentDetails = {};
        const whwRedemptionFlow = true;
        const midnightRedemptionFlow = true;
        const customerDetails = {};
        const isTysFlow = false;

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(result.fiveGWHWFlow).toBe("Y");
        expect(result.midnightWHWRedeem).toBe("Y");
        expect(result.fiveGInd).toBe("fiveg");
    });

    it('should handle isTysFlow and call populateTysPayloadParams', () => {
        const cart = { orderDetails: { totalDueToday: "100", locationCode: "001", isComboOrder: "N" } };
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
        const isTysFlow = true;

        mockPopulateTysPayloadParams.mockReturnValue({
            tysParam1: "value1",
            tysParam2: "value2"
        });

        const result = tncPayload(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails, isTysFlow);

        expect(mockPopulateTysPayloadParams).toHaveBeenCalledWith(cart, agreementEligibleFlags, encryptedCartId, channel, orderBalance, repeaterDeviceSku,
            isMultiLineRisaEnabled, orderPaymentDetails, whwRedemptionFlow, midnightRedemptionFlow, customerDetails);
        expect(result.tysParams).toEqual({
            tysParam1: "value1",
            tysParam2: "value2"
        });
    });
});

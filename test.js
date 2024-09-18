import { tncPayload } from './path-to-file';

describe('tncPayload function - getAALAgreementNo coverage', () => {
  it('should return correct AAL agreement number and string when AAL line exists', () => {
    const cart = {
      lineDetails: {
        lineInfo: [{
          mobileNumber: '1234567890', // Must match the value in mtnInstallmentList
          lineActivityType: 'AAL', // Must be 'AAL' to trigger getAALAgreementNo logic
          itemsInfo: [{ cartItems: { cartItem: [{ cartItemType: 'DEVICE', itemPrice: '200' }] } }]
        }]
      },
      orderDetails: {
        totalDueToday: 100, 
        locationCode: 'LOC123',
        isComboOrder: 'N'
      },
      cartHeader: { creditApplicationNum: 'CREDIT123' }
    };
    
    const agreementEligibleFlags = {
      showDeclineEquipmentProtection: true,
      showDeviceProtectionITTK: true,
      showRingAgreement: true,
      showLTEAgreement: false,
      show5GAgreement: true,
      showDPAgreement: false
    };

    // This is where the aalAgreementNo should come from
    const mtnInstallmentList = [
      {
        mtn: '1234567890', // Matches the mobile number in cart.lineDetails.lineInfo
        installmentLoanNumber: 'AAL_INST123' // The value we expect to be returned in aalAgreementNo
      }
    ];

    const expectedPayload = {
      encryptedCartId: 'encryptedCartId123',
      isMultiLineRisaEnabled: false,
      pageName: 'tandc',
      locationCode: 'LOC123',
      fcraEnabled: 'Y',
      upgradeAgreementNo: '',
      aalAgreementNo: 'AAL_INST123', // This should come from mtnInstallmentList
      upgradeTwoYear: 'N',
      aalTwoYear: 'Y',
      eqpDeclined: 'Y',
      showEquipmentProtection: 'Y',
      retailPrice: '200',
      channel: 'OMNI-CARE',
      backupPaymentFlag: 'N',
      creditAppNumber: 'CREDIT123',
      ringType: 'Y',
      orderType: 'M',
      homeMobileCombo: 'N',
      fiveGInd: 'fiveg'
    };

    // Call tncPayload with necessary data
    const payload = tncPayload(
      cart,
      agreementEligibleFlags,
      'encryptedCartId123',
      'OMNI-CARE',
      0,
      'SC-EZCONNECT',
      false, // isMultiLineRisaEnabled
      [], // orderPaymentDetails
      false, // whwRedemptionFlow
      false, // midnightRedemptionFlow
      {}, // customerDetails
      false // isTysFlow
    );

    // Check if aalAgreementNo is correctly set from mtnInstallmentList
    expect(payload.aalAgreementNo).toBe('AAL_INST123');
    expect(payload.aalTwoYear).toBe('Y');
    expect(payload).toEqual(expectedPayload);
  });
});

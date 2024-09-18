import { populateTysPayloadParams } from './path-to-file';

describe('populateTysPayloadParams', () => {
  it('should populate payload with tysFlow and process tysMtnInstallmentList and devicePromotionMTNList', () => {
    const payload = {};
    const agreementEligibleFlags = {
      dpAgreementInfo: [
        { mtn: '12345', otherInfo: 'test' }
      ],
      mtnInstallmentList: [
        { mtn: '12345', installmentLoanNumber: 'ABC123' }
      ],
      showDevicePromotion: true,
      devicePromotionMTNList: ['78910']
    };
    const customerDetails = {
      firstName: 'John',
      lastName: 'Doe'
    };

    const result = populateTysPayloadParams(payload, agreementEligibleFlags, customerDetails);

    expect(result).toEqual({
      tysFlow: 'Y',
      tysMtnInstallmentList: [
        { mtn: '12345', otherInfo: 'test', installmentLoanNumber: 'ABC123' }
      ],
      tysShowDevicePromotion: true,
      tysDevicePromotionMTNList: ['78910'],
      customerFirstName: 'John',
      customerLastName: 'Doe'
    });
  });

  it('should handle empty tysMtnInstallmentList and missing devicePromotionMTNList', () => {
    const payload = {};
    const agreementEligibleFlags = {
      dpAgreementInfo: [],
      showDevicePromotion: false
    };
    const customerDetails = {};

    const result = populateTysPayloadParams(payload, agreementEligibleFlags, customerDetails);

    expect(result).toEqual({
      tysFlow: 'Y',
      tysMtnInstallmentList: [],
      customerFirstName: '',
      customerLastName: ''
    });
  });

  it('should handle undefined agreementEligibleFlags and customerDetails', () => {
    const payload = {};
    const agreementEligibleFlags = undefined;
    const customerDetails = undefined;

    const result = populateTysPayloadParams(payload, agreementEligibleFlags, customerDetails);

    expect(result).toEqual({
      tysFlow: 'Y',
      tysMtnInstallmentList: [],
      customerFirstName: '',
      customerLastName: ''
    });
  });

  it('should assign default values when properties are missing', () => {
    const payload = {};
    const agreementEligibleFlags = {
      dpAgreementInfo: []
    };
    const customerDetails = {};

    const result = populateTysPayloadParams(payload, agreementEligibleFlags, customerDetails);

    expect(result).toEqual({
      tysFlow: 'Y',
      tysMtnInstallmentList: [],
      customerFirstName: '',
      customerLastName: ''
    });
  });
});

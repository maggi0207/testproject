import { getEUPAgreementNo } from './path-to-file';

describe('getEUPAgreementNo', () => {

  it('should return the correct eupAgreementNum and eupMtnInstallmentString when mobile number matches and lineActivityType is EUP', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'EUP'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'EUP_INST123' }
      ]
    };

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('EUP_INST123');
    expect(result.eupMtnInstallmentString).toBe('1234567890');
  });

  it('should return the correct eupAgreementNum and eupMtnInstallmentString when mobile number matches and lineActivityType is NSE', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'NSE'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'NSE_INST123' }
      ]
    };

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('NSE_INST123');
  });

  it('should return the correct eupAgreementNum and eupMtnInstallmentString when mobile number matches and lineActivityType is NSE_LTE', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'NSE_LTE'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'LTE_INST123' }
      ]
    };

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('LTE_INST123');
  });

  it('should return the correct eupAgreementNum and eupMtnInstallmentString when mobile number matches and lineActivityType is NSE_5G and cBandQualified is true', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'NSE_5G'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: '5G_INST123' }
      ]
    };

    const props = { cBandQualified: true }; // Simulate cBandQualified prop

    const result = getEUPAgreementNo.call({ props }, cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('5G_INST123');
    expect(result.eupMtnInstallmentString).toBe('1234567890');
  });

  it('should return empty eupAgreementNum if no mobile number matches', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '0987654321',
            lineActivityType: 'EUP'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'EUP_INST123' }
      ]
    };

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('');
  });

  it('should return empty eupAgreementNum if lineActivityType is not EUP or NSE variants', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'OTHER'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'EUP_INST123' }
      ]
    };

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('');
    expect(result.eupMtnInstallmentString).toBe('1234567890');
  });

  it('should return empty eupAgreementNum if mtnInstallmentList is undefined or empty', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'EUP'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: undefined
    };

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result.eupAgreementNum).toBe('');
  });

  it('should handle errors gracefully and return empty string', () => {
    // Simulate an error by passing invalid data
    const cart = null; 
    const agreementOptions = null;

    const result = getEUPAgreementNo(cart, agreementOptions);

    expect(result).toBe(''); // Should return empty string when an error occurs
  });
});

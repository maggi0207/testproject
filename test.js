import { getAALAgreementNo } from './path-to-file';

describe('getAALAgreementNo', () => {

  it('should return the correct aalAgreementNum and aalMtnInstallmentString when mobile number matches and lineActivityType is AAL', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'AAL'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'AAL_INST123' }
      ]
    };

    const result = getAALAgreementNo(cart, agreementOptions);

    expect(result.aalAgreementNum).toBe('AAL_INST123');
    expect(result.aalMtnInstallmentString).toBe('1234567890');
  });

  it('should return empty string if no mobile number matches', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '0987654321',
            lineActivityType: 'AAL'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'AAL_INST123' }
      ]
    };

    const result = getAALAgreementNo(cart, agreementOptions);

    expect(result.aalAgreementNum).toBe('');
    expect(result.aalMtnInstallmentString).toBe('1234567890');
  });

  it('should return empty aalAgreementNum if lineActivityType is not AAL', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'EUP' // Not AAL
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: [
        { mtn: '1234567890', installmentLoanNumber: 'AAL_INST123' }
      ]
    };

    const result = getAALAgreementNo(cart, agreementOptions);

    expect(result.aalAgreementNum).toBe('');
    expect(result.aalMtnInstallmentString).toBe('1234567890');
  });

  it('should return empty string if mtnInstallmentList is undefined or empty', () => {
    const cart = {
      lineDetails: {
        lineInfo: [
          {
            mobileNumber: '1234567890',
            lineActivityType: 'AAL'
          }
        ]
      }
    };

    const agreementOptions = {
      mtnInstallmentList: undefined // No installment list
    };

    const result = getAALAgreementNo(cart, agreementOptions);

    expect(result.aalAgreementNum).toBe('');
    expect(result.aalMtnInstallmentString).toBe('');
  });

  it('should handle errors gracefully and return empty string', () => {
    // Simulate an error by passing invalid data
    const cart = null; 
    const agreementOptions = null;

    const result = getAALAgreementNo(cart, agreementOptions);

    expect(result).toBe(''); // Should return empty string when an error occurs
  });
});

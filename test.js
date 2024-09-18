// Import the functions to be tested
import { getBackupPaymentFlagForAgreement, getBackupPaymentEligible } from './path-to-file';

// Declare the cart and channel values for different scenarios
const cartWithEdgeLines = {
    lineDetails: {
        lineInfo: [
            {
                installmentInfo: {
                    installmentTerm: 12, // This will make getBackupPaymentEligible return true
                },
                mobileNumber: '1234567890',
            },
        ],
    },
};

const cartWithoutEdgeLines = {
    lineDetails: {
        lineInfo: [
            {
                installmentInfo: {
                    installmentTerm: 0, // This will make getBackupPaymentEligible return false
                },
                mobileNumber: '1234567890',
            },
        ],
    },
};

// Test suite
describe('getBackupPaymentFlagForAgreement', () => {
    it('should return "Y" when eligible and there is a credit card payment', () => {
        // Arrange
        const channel = 'OMNI-CARE';
        const paymentDetails = [{ modeOfPay: 'CR' }]; // Payment type is CR

        // Act
        const result = getBackupPaymentFlagForAgreement(cartWithEdgeLines, channel, paymentDetails);

        // Assert
        expect(result).toBe('Y');
    });

    it('should return "N" when eligible but no credit card payments', () => {
        // Arrange
        const channel = 'OMNI-CARE';
        const paymentDetails = [{ modeOfPay: 'PP' }]; // Payment type is not CR

        // Act
        const result = getBackupPaymentFlagForAgreement(cartWithEdgeLines, channel, paymentDetails);

        // Assert
        expect(result).toBe('N');
    });

    it('should return "N" when not eligible', () => {
        // Arrange
        const channel = 'OMNI-CARE';
        const paymentDetails = [{ modeOfPay: 'CR' }]; // Payment type is CR

        // Act
        const result = getBackupPaymentFlagForAgreement(cartWithoutEdgeLines, channel, paymentDetails);

        // Assert
        expect(result).toBe('N');
    });

    it('should return "N" when paymentDetails is empty', () => {
        // Arrange
        const channel = 'OMNI-CARE';
        const paymentDetails = []; // No payment details

        // Act
        const result = getBackupPaymentFlagForAgreement(cartWithEdgeLines, channel, paymentDetails);

        // Assert
        expect(result).toBe('N');
    });

    it('should return "N" when an exception is thrown', () => {
        // Temporarily override the implementation to simulate an exception
        const originalImplementation = getBackupPaymentEligible;
        getBackupPaymentEligible = () => { throw new Error('Test Error'); };

        // Arrange
        const channel = 'OMNI-CARE';
        const paymentDetails = [{ modeOfPay: 'CR' }]; // Payment type is CR

        // Act
        const result = getBackupPaymentFlagForAgreement(cartWithEdgeLines, channel, paymentDetails);

        // Assert
        expect(result).toBe('N');

        // Restore original implementation
        getBackupPaymentEligible = originalImplementation;
    });
});

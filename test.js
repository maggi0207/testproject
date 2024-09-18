// path-to-your-test-file.js

// Import the functions to be tested
import { getBackupPaymentFlagForAgreement, getBackupPaymentEligible } from './path-to-file';

// Declare mocks
const mockGetBackupPaymentEligible = jest.fn();
const mockGetBackupPaymentFlagForAgreement = jest.fn();

// Mock the actual implementations with our mock functions
jest.mock('./path-to-file', () => ({
    getBackupPaymentFlagForAgreement: mockGetBackupPaymentFlagForAgreement,
    getBackupPaymentEligible: mockGetBackupPaymentEligible,
}));

describe('getBackupPaymentFlagForAgreement', () => {
    beforeEach(() => {
        // Clear previous mock calls and implementations
        mockGetBackupPaymentEligible.mockClear();
        mockGetBackupPaymentFlagForAgreement.mockClear();
    });

    it('should return "Y" when eligible and there is a credit card payment', () => {
        // Arrange
        const cart = {};
        const channel = 'OMNI-CARE';
        const paymentDetails = [{ modeOfPay: 'CR' }];
        mockGetBackupPaymentEligible.mockReturnValue(true);

        // Act
        const result = getBackupPaymentFlagForAgreement(cart, channel, paymentDetails);

        // Assert
        expect(result).toBe('Y');
    });

    it('should return "N" when not eligible', () => {
        // Arrange
        const cart = {};
        const channel = 'OMNI-CARE';
        const paymentDetails = [{ modeOfPay: 'CR' }];
        mockGetBackupPaymentEligible.mockReturnValue(false);

        // Act
        const result = getBackupPaymentFlagForAgreement(cart, channel, paymentDetails);

        // Assert
        expect(result).toBe('N');
    });

    it('should return "N" when paymentDetails is empty', () => {
        // Arrange
        const cart = {};
        const channel = 'OMNI-CARE';
        const paymentDetails = [];
        mockGetBackupPaymentEligible.mockReturnValue(true);

        // Act
        const result = getBackupPaymentFlagForAgreement(cart, channel, paymentDetails);

        // Assert
        expect(result).toBe('N');
    });
});

describe('getBackupPaymentEligible', () => {
    beforeEach(() => {
        // Clear previous mock calls and implementations
        mockGetBackupPaymentEligible.mockClear();
    });

    it('should return true when the channel is valid and lineInfo contains installment term', () => {
        // Arrange
        const cart = {
            lineDetails: {
                lineInfo: [
                    { installmentInfo: { installmentTerm: 12 } },
                ],
            },
        };
        const channel = 'OMNI-CARE';

        // Act
        const result = getBackupPaymentEligible(cart, channel);

        // Assert
        expect(result).toBe(true);
    });

    it('should return false when the channel is invalid', () => {
        // Arrange
        const cart = {
            lineDetails: {
                lineInfo: [
                    { installmentInfo: { installmentTerm: 12 } },
                ],
            },
        };
        const channel = 'INVALID-CHANNEL';

        // Act
        const result = getBackupPaymentEligible(cart, channel);

        // Assert
        expect(result).toBe(false);
    });

    it('should return false when lineInfo does not contain installment term', () => {
        // Arrange
        const cart = {
            lineDetails: {
                lineInfo: [
                    { installmentInfo: { installmentTerm: 0 } },
                ],
            },
        };
        const channel = 'OMNI-CARE';

        // Act
        const result = getBackupPaymentEligible(cart, channel);

        // Assert
        expect(result).toBe(false);
    });
});

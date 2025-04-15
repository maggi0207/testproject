const isPaymentTypeAC = paymentDetails?.some((payment) => payment.modeOfPay === 'AC');

const isOmniIndirect = isPrePayCart && channel?.includes('OMNI-INDIRECT');
const isOmniRetailWithAC = channel?.includes('OMNI-RETAIL') && isPaymentTypeAC && !isRFEXNegativePayment;
const isOmniCareWithDiscount =
  channel === 'OMNI-CARE' && agreementEligibleFlags?.showNetworkExtenderTnCDiscountApplied;

const signatureRequired =
  isOmniIndirect ||
  isOmniRetailWithAC ||
  agreementEligibleFlags?.showSignatureRequired ||
  isWHWFlow ||
  isOmniCareWithDiscount;

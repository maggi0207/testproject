const isPaymentTypeAC = paymentDetails?.some((payment) => payment.modeOfPay === 'AC');

  let signatureRequired;
  // #3
  if (isPrePayCart && channel?.includes('OMNI-INDIRECT')) {
    signatureRequired = true;
  } else if (channel?.includes('OMNI-RETAIL') && isPaymentTypeAC && !isRFEXNegativePayment) {
    signatureRequired = true;
  } else {
    signatureRequired =
      agreementEligibleFlags?.showSignatureRequired ||
      isWHWFlow ||
      (channel === 'OMNI-CARE' && agreementEligibleFlags?.showNetworkExtenderTnCDiscountApplied);
  }

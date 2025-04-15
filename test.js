useEffect(() => {
  if (!retrievePaymentOptionsResult) return;

  const hasValidOptions =
    retrievePaymentOptionsResult.paymentOptions?.length > 0 &&
    changedPaymentModes?.length === 0;

  const isZeroDollarOrder =
    orderBalance === 0 && retrievePaymentOptionsResult?.orderTotal === 0;

  const isOpenZeroOrder =
    orderBalance === 0 &&
    !retrievePaymentOptionsResult?.orders?.[0]?.orderClosed &&
    retrievePaymentOptionsResult?.orderTotal === 0;

  if (hasValidOptions) {
    updatePaymentModes();
    updatePaymentDetails();
    setOrderBalance(retrievePaymentOptionsResult.orderBalance);
    handleBackArrowDisplay();
    maybeShowSplitTenderWarning(channelDisplayFlags?.blockSplitPayment);
  }

  if (scmCheckoutMfeEnabled && isZeroDollarOrder) {
    setZeroDollarOrder(true);
  }

  if (isOpenZeroOrder) {
    setSubmitApiSuccess(true);
    setZeroDollarOrder(true);
  } else if (orderBalance === 0) {
    setSubmitApiSuccess(true);
  }
}, [retrievePaymentOptionsResult]);

// === Helper Functions (use outer scoped values) ===

const updatePaymentModes = () => {
  const modes = paymentOptions
    .map((option) => option.paymentType)
    .filter((type) => type !== 'CK');
  setChangedPaymentModes(modes);
};

const updatePaymentDetails = () => {
  const orders = retrievePaymentOptionsResult?.orders || [];

  if (splitFullfillmentEnablement() && itemLevelShipment && orders.length > 1) {
    const splitDetails = orders.flatMap((order) => order.paymentDetail || []);
    setPaymentDetail(filterValidPayments(splitDetails));
  } else {
    const firstOrderDetails = orders[0]?.paymentDetail || [];
    setPaymentDetail(filterValidPayments(firstOrderDetails));
  }
};

const filterValidPayments = (paymentDetails) =>
  paymentDetails
    .filter((p) => p?.paymentStatus !== 'V')
    .filter((p) => p?.modeOfPay !== 'IE' && p?.modeOfPay !== 'BA');

const handleBackArrowDisplay = () => {
  const details = retrievePaymentOptionsResult?.orders?.[0]?.paymentDetail;
  if (details?.length) {
    setShowBackArrow(false);
  }
};

const maybeShowSplitTenderWarning = (blockSplitPayment) => {
  if (blockSplitPayment) {
    dispatch(
      appMessageActions.addAppMessage(
        'Must select single payment option for this order (cannot use split tender).',
        'info',
        true,
        true,
      )
    );
  }
};

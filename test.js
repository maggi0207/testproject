useEffect(() => {
  if (!retrievePaymentOptionsResult) return;

  const {
    paymentOptions = [],
    orders = [],
    orderBalance,
    orderTotal,
  } = retrievePaymentOptionsResult;

  const hasValidOptions = paymentOptions.length > 0 && changedPaymentModes?.length === 0;

  const isZeroDollarOrder = orderBalance === 0 && orderTotal === 0;
  const isOpenZeroOrder =
    orderBalance === 0 && !orders[0]?.orderClosed && orderTotal === 0;

  if (hasValidOptions) {
    updatePaymentModes(paymentOptions);
    updatePaymentDetails(orders);
    setOrderBalance(orderBalance);
    handleBackArrowDisplay(orders);
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

// === Helper Functions ===

const updatePaymentModes = (paymentOptions) => {
  const paymentModes = paymentOptions.map((option) => option.paymentType);
  const modes = paymentModes.filter((option) => option !== 'CK');
  setChangedPaymentModes(modes);
};

const updatePaymentDetails = (orders) => {
  if (splitFullfillmentEnablement() && itemLevelShipment && orders?.length > 1) {
    const splitDetails = orders.map((order) => order.paymentDetail).flat() || [];
    const filtered = filterValidPayments(splitDetails);
    setPaymentDetail(filtered);
  } else {
    const firstOrderDetails = orders[0]?.paymentDetail || [];
    const filtered = filterValidPayments(firstOrderDetails);
    setPaymentDetail(filtered);
  }
};

const filterValidPayments = (paymentDetails) =>
  paymentDetails
    ?.filter((payment) => payment?.paymentStatus !== 'V')
    ?.filter((payment) => payment?.modeOfPay !== 'IE' && payment?.modeOfPay !== 'BA');

const handleBackArrowDisplay = (orders) => {
  if (orders[0]?.paymentDetail?.length) {
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
      ),
    );
  }
};

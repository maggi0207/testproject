useEffect(() => {
  if (!submitPaymentResult?.data) return;

  const data = submitPaymentResult.data;
  const orders = data?.orders || [];

  if (Object.keys(data).length) {
    handleBackArrowVisibility(orders);
    handlePaymentDetailUpdate(data);
    handleBalanceAndPaymentModes(data);
    handleOrderStatusCheck(orders);
    setGiftCardNumber('');
    showAppMessage('Submit Payment Completed Successfully', 'success');
  }

  if (
    window.sessionStorage.getItem('isViewTogether') === 'true' &&
    submitPaymentResult.status !== 'uninitialized' &&
    submitPaymentResult.status !== 'pending'
  ) {
    handleViewTogetherFlow(submitPaymentResult);
  }
}, [submitPaymentResult?.status, submitRemarkResult?.data]);



const handleBackArrowVisibility = (orders) => {
  if (orders?.[0]?.paymentDetail?.length > 0) {
    setShowBackArrow(false);
  }
};

const handlePaymentDetailUpdate = (data) => {
  const orders = data?.orders || [];

  const getFilteredDetails = (details) =>
    details
      ?.filter((p) => p?.paymentStatus !== 'V')
      ?.filter((p) => !['IE', 'BA'].includes(p?.modeOfPay));

  if (splitFullfillmentEnablement() && itemLevelShipment) {
    const splitDetails = orders.flatMap((o) => o.paymentDetail || []);
    if (JSON.stringify(splitDetails) !== JSON.stringify(paymentDetail)) {
      setPaymentDetail(getFilteredDetails(splitDetails));
    }
  } else {
    const newDetails = orders?.[0]?.paymentDetail || [];
    if (JSON.stringify(newDetails) !== JSON.stringify(paymentDetail)) {
      setPaymentDetail(getFilteredDetails(newDetails));
    }
  }
};

const handleBalanceAndPaymentModes = (data) => {
  setOrderBalance(data.orderBalance);
  setPaymentType('');

  if (data.balanceExist) {
    setChangedPaymentModes(data.paymentOptions?.map((o) => o.paymentType));
  } else {
    setSubmitApiSuccess(true);
  }
};

const handleOrderStatusCheck = (orders) => {
  if (orders?.length > 0 && isRxOrderReview) {
    const isAllVoid = orders.every((o) => o?.void === true);
    setOrderStatus(isAllVoid);
  }
};

const handleViewTogetherFlow = (submitPaymentResult) => {
  const status = submitPaymentResult?.status;
  const data = submitPaymentResult?.data;

  if (status === 'rejected') {
    if (isTrustlyActionsProcessed.submitPayment) {
      trustlySubmitPaymentResultHelper(submitPaymentResult.error?.data?.errors?.[0]?.message);
    } else {
      const fallbackMessage = submitPaymentResult.error?.data?.errors?.[0]?.message || 'Payment failed';
      const body1 = errorSendMessageBody(clientId, 'Payment failed');
      const body2 = errorSendMessageBody(clientId, fallbackMessage);

      requestBodySendMsg({ body: body1, spinner: false, mock: false });
      requestBodySendMsg({ body: body2, spinner: false, mock: false });
    }
  } else if (status === 'fulfilled') {
    const body = makPaymentPayload(
      cartDetails,
      customerProfile,
      getEligibleAgreementOptionsResult,
      cBandQualified,
      encryptedCartId,
    );
    body.pageName = 'tandc';
    body.isVTProfileRegEnabled =
      cartDetails?.lineDetails?.lineInfo?.length === 1 && customerType === 'N' && isVTProfileRegEnabled === 'TRUE'
        ? 'Y'
        : 'N';

    const makePaymentBody = {
      ...sendMsgTandCBody,
      clientId,
      payload: body,
    };

    const shouldSendTandC =
      window.sessionStorage.getItem('isViewTogether') === 'true' && !data?.balanceExist;

    if (shouldSendTandC) {
      requestBodySendMsg({ body: makePaymentBody, spinner: false, mock: false });
    } else if (scmUpgradeMfeEnable && data?.balanceExist) {
      const balancePaymentBody = getBalanceSendMessageBody(
        submitPaymentResult,
        cartDetails,
        customerProfile,
        retrievePaymentOptionsResult,
        '',
        paxAuth,
        clientId,
      );
      requestBodySendMsg({ body: balancePaymentBody, spinner: true, mock: false });
    }

    if (isTrustlyActionsProcessed.submitPayment && data?.balanceExist) {
      trustlySubmitPaymentResultHelper();
    }
  }
};

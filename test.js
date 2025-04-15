 useEffect(() => {
    if (retrievePaymentOptionsResult?.paymentOptions?.length > 0 && changedPaymentModes?.length === 0) {
      const paymentModes = retrievePaymentOptionsResult.paymentOptions.map((option) => option.paymentType);
      const modes = paymentModes.filter((option) => option !== 'CK');
      setChangedPaymentModes(modes);
      //#1
      if (splitFullfillmentEnablement() && itemLevelShipment && retrievePaymentOptionsResult?.orders?.length > 1) {
        const splitFulfillmentPaymentDetails =
          retrievePaymentOptionsResult?.orders?.map((order) => order.paymentDetail).flat() || [];
        const sortedSFPaymentDetails = splitFulfillmentPaymentDetails
          ?.filter((payment) => payment?.paymentStatus !== 'V')
          ?.filter((payment) => payment?.modeOfPay !== 'IE' && payment?.modeOfPay !== 'BA');
        setPaymentDetail(sortedSFPaymentDetails);
      } else {
        const newPaymentDetails = retrievePaymentOptionsResult?.orders[0]?.paymentDetail || [];
        const sortedPaymentDetails = newPaymentDetails
          ?.filter((payment) => payment.paymentStatus !== 'V')
          ?.filter((payment) => payment.modeOfPay !== 'IE' && payment.modeOfPay !== 'BA');
        setPaymentDetail(sortedPaymentDetails);
      }
      setOrderBalance(retrievePaymentOptionsResult?.orderBalance);
      /* istanbul ignore else */
      if (
        retrievePaymentOptionsResult?.orders[0]?.paymentDetail &&
        retrievePaymentOptionsResult?.orders[0]?.paymentDetail?.length
      ) {
        setShowBackArrow(false);
      }
      if (channelDisplayFlags?.blockSplitPayment) {
        dispatch(
          appMessageActions.addAppMessage(
            'Must select single payment option for this order (cannot use split tender).',
            'info',
            true,
            true,
          ),
        );
      }
    }
    const scmZeroDollar =
      retrievePaymentOptionsResult?.orderBalance === 0 && retrievePaymentOptionsResult?.orderTotal === 0;
    if (scmCheckoutMfeEnabled && scmZeroDollar) {
      setZeroDollarOrder(true);
    }
    if (
      retrievePaymentOptionsResult?.orderBalance === 0 &&
      !retrievePaymentOptionsResult?.orders[0]?.orderClosed &&
      retrievePaymentOptionsResult?.orderTotal === 0
    ) {
      setSubmitApiSuccess(true);
      setZeroDollarOrder(true);
    } else if (retrievePaymentOptionsResult?.orderBalance === 0) {
      setSubmitApiSuccess(true);
    }
  }, [retrievePaymentOptionsResult]);

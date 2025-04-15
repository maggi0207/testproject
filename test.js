 useEffect(() => {
    // #2
    if (submitPaymentResult?.data) {
      /* istanbul ignore else */
      if (Object.keys(submitPaymentResult?.data)) {
        if (submitPaymentResult?.data?.orders?.[0]?.paymentDetail?.length > 0) {
          setShowBackArrow(false);
        }
        if (splitFullfillmentEnablement() && itemLevelShipment) {
          const splitFulfillmentPaymentDetails =
            submitPaymentResult?.data?.orders?.map((order) => order.paymentDetail).flat() || [];
          if (JSON.stringify(splitFulfillmentPaymentDetails) !== JSON.stringify(paymentDetail)) {
            const sortedSFPaymentDetails = splitFulfillmentPaymentDetails
              ?.filter((payment) => payment?.paymentStatus !== 'V')
              ?.filter((payment) => payment?.modeOfPay !== 'IE' && payment?.modeOfPay !== 'BA');
            setPaymentDetail(sortedSFPaymentDetails);
          }
        } else {
          const newPaymentDetails = submitPaymentResult?.data?.orders?.[0]?.paymentDetail || [];
          if (JSON.stringify(newPaymentDetails) !== JSON.stringify(paymentDetail)) {
            const sortedPaymentDetails = newPaymentDetails
              ?.filter((payment) => payment.paymentStatus !== 'V')
              ?.filter((payment) => payment.modeOfPay !== 'IE' && payment.modeOfPay !== 'BA');
            setPaymentDetail(sortedPaymentDetails);
          }
        }
        /* istanbul ignore else */
        if (submitPaymentResult?.data?.balanceExist) {
          setOrderBalance(submitPaymentResult?.data?.orderBalance);
          setPaymentType('');

          setChangedPaymentModes(submitPaymentResult?.data?.paymentOptions?.map((option) => option.paymentType));
        } else if (!submitPaymentResult?.data?.balanceExist) {
          setOrderBalance(submitPaymentResult?.data?.orderBalance);
          setPaymentType('');
          setSubmitApiSuccess(true);
        }

        // Check valid Order status
        if (submitPaymentResult?.data?.orders?.length > 0 && isRxOrderReview) {
          const rst = submitPaymentResult?.data?.orders.every((item) => item?.void === true);
          setOrderStatus(rst);
        }
        setGiftCardNumber('');
        showAppMessage('Submit Payment Completed Successfully', 'success');
      }
    }
    if (
      window.sessionStorage.getItem('isViewTogether') === 'true' &&
      submitPaymentResult.status !== 'uninitialized' &&
      submitPaymentResult.status !== 'pending'
    ) {
      if (submitPaymentResult?.status === 'rejected') {
        if (isTrustlyActionsProcessed.submitPayment) {
          trustlySubmitPaymentResultHelper(submitPaymentResult.error.data.errors[0].message);
        } else {
          const body = errorSendMessageBody(clientId, 'Payment failed');
          requestBodySendMsg({ body, spinner: false, mock: false });
          const payload = errorSendMessageBody(clientId, submitPaymentResult.error.data.errors[0].message);
          requestBodySendMsg({ body: payload, spinner: false, mock: false });
        }
      } else if (submitPaymentResult?.status === 'fulfilled') {
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
        /* istanbul ignore else */
        if (window.sessionStorage.getItem('isViewTogether') === 'true' && !submitPaymentResult?.data?.balanceExist) {
          requestBodySendMsg({ body: makePaymentBody, spinner: false, mock: false });
        } else if (scmUpgradeMfeEnable && submitPaymentResult?.data?.balanceExist) {
          const balancePaymentbody = getBalanceSendMessageBody(
            submitPaymentResult,
            cartDetails,
            customerProfile,
            retrievePaymentOptionsResult,
            '',
            paxAuth,
            clientId,
          );
          requestBodySendMsg({ body: balancePaymentbody, spinner: true, mock: false });
        }

        if (isTrustlyActionsProcessed.submitPayment && submitPaymentResult?.data?.balanceExist) {
          trustlySubmitPaymentResultHelper();
        }
      }
    }
  }, [submitPaymentResult?.status, submitRemarkResult?.data]);

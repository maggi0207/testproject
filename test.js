 const invokeReceivePoll = async (eventData) => {
    handleSingnatrueReceivePoll(
      eventData,
      clientId,
      cartDetails,
      customerProfileData,
      submitSignatureAPI,
      requestBodySendMsg,
      VTZDSubmitPayment,
      VTSetIPAddress,
      zeroDollarOrder,
      singnatureReceiveCallBack
    );
  };

  const VTZDSubmitPayment = (signatureReqBody, makePaymentReqBody) => {
    const custIP = sessionStorage.getItem('customerIPAddress') ? sessionStorage.getItem('customerIPAddress') : '';
    const newSignatureReqBody = { ...signatureReqBody };
    newSignatureReqBody.ipAddress = custIP;
    setSignatrueRquestBody(newSignatureReqBody);
    setMakePaymentBody(makePaymentReqBody);
    console.log(makePaymentBody);
    const body = {
      ipAddress: custIP,
      paymentType: 'ZD',
      paymentAmount: 0,
      customerInfo: {
        processingMTN: cartHeader?.cartCreator,
        cartCreator: cartHeader?.cartCreator,
      },
      regNo: '51',
      isIndirectBuyOut: false,
      orderNumber,
      isIpad,
    };

    if (signatureReqBody?.safeTechSessionId) {
      body.safeTechSession = 'true';
      body.safeTechSessionId = signatureReqBody?.safeTechSessionId;
    }

    submitPayment({ body, spinner: true, mock: false });
  };

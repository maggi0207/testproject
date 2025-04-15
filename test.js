// 🧪 Mock handleSingnatrueReceivePoll to invoke VTZDSubmitPayment
    jest.spyOn(utils, 'handleSingnatrueReceivePoll').mockImplementation((
      _eventData,
      _clientId,
      _cartDetails,
      _customerProfileData,
      _submitSignatureAPI,
      _requestBodySendMsg,
      VTZDSubmitPayment,
    ) => {
      // You can pass your own signatureReqBody and makePaymentReqBody here
      const signatureReqBody = { safeTechSessionId: mockSafeTechSessionId };
      const makePaymentReqBody = { someKey: 'someValue' };
      VTZDSubmitPayment(signatureReqBody, makePaymentReqBody);
    });

    // 🧪 Set IP in sessionStorage
    sessionStorage.setItem('customerIPAddress', '127.0.0.1');

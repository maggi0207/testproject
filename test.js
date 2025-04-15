describe('recievepoll api call for scm flow', () => {
  test('invokeReceivePoll Cll is made', async () => {
    window.mfe = { scmCheckoutMfeEnable: true, historyRef: [] };
    // const invokeReceivePoll = jest.fn();
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const spy = jest.spyOn(apiHooks, 'useLazyGenerateAndSaveReceiptsQuery');
    spy.mockReturnValue([
      jest.fn(),
      {
        status: 'pending',
        isUninitialized: false,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isFetching: false,
        data: { data: {} },
      },
    ]);

    render(
      <SignatureDisplay
        isTysFlow={signatureDisplayProps.isTysFlow}
        cartOrderDetails={signatureDisplayProps.cartOrderDetails}
        cartHeader={signatureDisplayProps.cartHeader}
        cartMtnDetails={signatureDisplayProps.cartMtnDetails}
        isFullAuthFailed={signatureDisplayProps.isFullAuthFailed}
        isRFEXNegativePayment={signatureDisplayProps.isRFEXNegativePayment}
        isPrePayCart={signatureDisplayProps.isPrePayCart}
        inspicioToggleOn={signatureDisplayProps.inspicioToggleOn}
        agreementEligibleFlags={signatureDisplayProps.agreementEligibleFlags}
        WHWStatusEnabled={signatureDisplayProps.WHWStatusEnabled}
        isWHWFlow={signatureDisplayProps.isWHWFlowMocked}
        disableManualSignature={signatureDisplayProps.disableManualSignature}
        allowDeferredSignature={signatureDisplayProps.allowDeferredSignature}
        isQAFlow={signatureDisplayProps.isQAFlow}
        isItWillowPlan={signatureDisplayProps.isItWillowPlan}
        WHWOrderingTAndC={signatureDisplayProps.WHWOrderingTAndC}
        channelDisplayFlags={signatureDisplayProps.channelDisplayFlags}
        paymentDetails={signatureDisplayProps.paymentDetails}
        assistedFlags={signatureDisplayProps.assistedFlags}
        nextBillSummaryData={signatureDisplayProps.nextBillSummaryData}
        cartDetails={signatureDisplayProps.cartDetails}
      />,
      {
        reducers: rootReducer,
        sagas: rootSaga,
      },
    );
    const eventData = {
      detail: {
        status: 'Success',
        event: 'submitSignature',
        payload: {
          field: 'ipAddress',
          value: '1.2.3.4',
        },
      },
    };
    
    const mockValue = [true];
    getAssistedCradleProperty.mockReturnValue(mockValue);
    fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));
    window.mfe = { scmCheckoutMfeEnable: false, historyRef: [] };
    fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));
    expect(addEventListenerSpy).toHaveBeenCalledWith('receivePoll', expect.any(Function));
  });

  test('invokeReceivePoll Cll is made with empty ip', async () => {
    window.mfe = { scmCheckoutMfeEnable: true, historyRef: [] };
    // const invokeReceivePoll = jest.fn();
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const spy = jest.spyOn(apiHooks, 'useLazyGenerateAndSaveReceiptsQuery');
    spy.mockReturnValue([
      jest.fn(),
      {
        status: 'pending',
        isUninitialized: false,
        isLoading: false,
        isSuccess: true,
        isError: false,
        isFetching: false,
        data: { data: {} },
      },
    ]);

    render(
      <SignatureDisplay
        isTysFlow={signatureDisplayProps.isTysFlow}
        cartOrderDetails={signatureDisplayProps.cartOrderDetails}
        cartHeader={signatureDisplayProps.cartHeader}
        cartMtnDetails={signatureDisplayProps.cartMtnDetails}
        isFullAuthFailed={signatureDisplayProps.isFullAuthFailed}
        isRFEXNegativePayment={signatureDisplayProps.isRFEXNegativePayment}
        isPrePayCart={signatureDisplayProps.isPrePayCart}
        inspicioToggleOn={signatureDisplayProps.inspicioToggleOn}
        agreementEligibleFlags={signatureDisplayProps.agreementEligibleFlags}
        WHWStatusEnabled={signatureDisplayProps.WHWStatusEnabled}
        isWHWFlow={signatureDisplayProps.isWHWFlowMocked}
        disableManualSignature={signatureDisplayProps.disableManualSignature}
        allowDeferredSignature={signatureDisplayProps.allowDeferredSignature}
        isQAFlow={signatureDisplayProps.isQAFlow}
        isItWillowPlan={signatureDisplayProps.isItWillowPlan}
        WHWOrderingTAndC={signatureDisplayProps.WHWOrderingTAndC}
        channelDisplayFlags={signatureDisplayProps.channelDisplayFlags}
        paymentDetails={signatureDisplayProps.paymentDetails}
        assistedFlags={signatureDisplayProps.assistedFlags}
        nextBillSummaryData={signatureDisplayProps.nextBillSummaryData}
        cartDetails={signatureDisplayProps.cartDetails}
      />,
      {
        reducers: rootReducer,
        sagas: rootSaga,
      },
    );
    const eventData = {
      detail: {
        status: 'Success',
        event: 'submitSignature',
        payload: {
          field: 'ipAddress',
          value: '',
          safetechSessionId: 'sessionId123',
        },
      },
    };
    getAssistedCradleProperty.mockReturnValue([true, true]);
    fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));
    window.mfe = { scmCheckoutMfeEnable: false, historyRef: [] };
    fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));
    expect(addEventListenerSpy).toHaveBeenCalledWith('receivePoll', expect.any(Function));
  });
});

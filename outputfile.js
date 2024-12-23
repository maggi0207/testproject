{editTradeIn && !tradeInOpened && (
  window?.mfe?.scmUpgradeMfeEnable ? (
    <ModalWrap
      id={!window?.mfe?.scmDeviceMfeEnable && 'modalcontainer'}
      border={'1px solid'}
      height={'80%'}
      opened={editTradeIn}
      fullScreenDialog
      disableAnimation={false}
      closeButton={
        <Icon name='close' onClick={() => hideEditTradeIn()} />
      }
      disableOutsideClick
      contentContainer
      ariaLabel='Testing Modal'
      surface={'light'}
    >
      <BodyWrapper>
        <EditTradeIn
          enableReturnAnywhereAssisted={enableReturnAnywhereAssisted}
          showTradeAnywhereForBEWithoutEcpdCustomers={props?.tradeInData?.showTradeAnywhereForBEWithoutEcpdCustomers}
          hideEditTradeIn={() => hideEditTradeIn()}
          isModalView={true}
          editTradeIn={editTradeIn}
          tradeInDueMonthlyItems={props?.tradeInData?.tradeInDueMonthlyItems}
          tradeInDueTodayItems={props?.tradeInData?.tradeInDueTodayItems}
          removeTradeInRequest={(data) => removeTradeInRequest(data)}
          cartTradeInTypeHelper={() => cartTradeInTypeHelper()}
          customerInfo={props?.customerInfo}
          cartDetails={props?.cartDetails}
          tradeInItems={props?.tradeInData?.tradeInItems}
          addAppMessage={props?.addAppMessage}
          landing={props?.landing}
          assistedFlags={assistedFlags}
          enableReturnOptionsInContactCenterApps={enableReturnOptionsInContactCenterApps}
          makeSelectTradeInLocation={props?.tradeInLocation || ''}
          isAcctICEligible={props?.isAcctICEligible || ''}
          showReturnChoiceScreen={showReturnChoiceScreen}
          setShowReturnChoiceScreen={setShowReturnChoiceScreen}
          removeTradeinShippingType={removeTradeinShippingType}
        />
      </BodyWrapper>
    </ModalWrap>
  ) : (
    <EditTradeIn
      enableReturnAnywhereAssisted={enableReturnAnywhereAssisted}
      showTradeAnywhereForBEWithoutEcpdCustomers={props?.tradeInData?.showTradeAnywhereForBEWithoutEcpdCustomers}
      hideEditTradeIn={() => hideEditTradeIn()}
      isModalView={false}
      editTradeIn={editTradeIn}
      tradeInDueMonthlyItems={props?.tradeInData?.tradeInDueMonthlyItems}
      tradeInDueTodayItems={props?.tradeInData?.tradeInDueTodayItems}
      removeTradeInRequest={(data) => removeTradeInRequest(data)}
      cartTradeInTypeHelper={() => cartTradeInTypeHelper()}
      customerInfo={props?.customerInfo}
      cartDetails={props?.cartDetails}
      tradeInItems={props?.tradeInData?.tradeInItems}
      addAppMessage={props?.addAppMessage}
      landing={props?.landing}
      assistedFlags={assistedFlags}
      enableReturnOptionsInContactCenterApps={enableReturnOptionsInContactCenterApps}
      makeSelectTradeInLocation={props?.tradeInLocation || ''}
      isAcctICEligible={props?.isAcctICEligible || ''}
      showReturnChoiceScreen={showReturnChoiceScreen}
      setShowReturnChoiceScreen={setShowReturnChoiceScreen}
      removeTradeinShippingType={removeTradeinShippingType}
    />
  )
)}

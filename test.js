const returnOptions = () => {
  const { visionCustomerType } = getShippingItemDetails();
  const dropOffStoreText = isEnabledTradeReturnOptionsInContactCenterApps
    ? "Bring device to a Verizon store"
    : "Drop device off at Verizon store later";

  const isMultiTrade = false;
  let shippingOptions = [
    {
      name: "group",
      children: (
        <div className="Grid shippingOption u-paddingNone">
          <div className="bold optionText">Trade-in device right now</div>
          <div className="Row optionSubText">
            The trade-in device can be assessed and collected for processing in the store
          </div>
        </div>
      ),
      value: "tradeinNow",
      ariaLabel: "Trade-in device right now",
      className: "tradeRadiobutton",
    },
    {
      name: "group",
      label: "Bring device to a Verizon store",
      children: (
        <>
          <StoreDetailsWrapper>
            <TooltipContent>
              <Body size="large" color="#000000">
                {getStoreDetailsDisplayText(preferredStoreInfo)}
              </Body>
              {preferredStoreInfo && (
                <Tooltip title="Store details" size="medium" surface="light">
                  {preferredStoreInfo?.storeName} <br />
                  {`${preferredStoreInfo?.storeAddressLine1}, ${preferredStoreInfo?.city}, ${preferredStoreInfo?.state}`}{' '}
                  <br />
                  Phone: {formatPhoneNumber(mdn)} <br />
                  <br />
                  Today's hours :<br /> {formatTodaysHours(preferredStoreInfo)}
                </Tooltip>
              )}
            </TooltipContent>
          </StoreDetailsWrapper>
          <TextLinkCaretWrapper data-testid="editLocationWrapper">
            <TextLinkCaret
              surface="light"
              iconPosition="right"
              data-track="Edit location button"
              onClick={() =>
                chooseTradeInSelected === 'tradeinLater' && setCurrentSection('StoreSelection')
              }
            >
              Edit location
            </TextLinkCaret>
          </TextLinkCaretWrapper>
        </>
      ),
      value: "tradeinLater",
      ariaLabel: dropOffStoreText,
      'data-track': "Tradein_later",
      disabled: false,
    },
  ];

  if (isEnabledTradeReturnOptionsInContactCenterApps) {
    const shippingLabelAndQrOption = [
      {
        name: "group",
        children: (
          <div className="Grid shippingOption u-paddingNone">
            <div className="bold optionText">Print UPS shipping label and use my own box</div>
            <div className="Row optionSubText">
              We'll email you a prepaid shipping label. Print it, attach it to your own box and bring it to a UPS drop off location.
            </div>
          </div>
        ),
        value: "PrepaidLabel",
        ariaLabel: "Print UPS shipping label and use my own box",
        className: "tradeRadiobutton",
      },
      {
        name: "group",
        children: (
          <div className="Grid shippingOption u-paddingNone">
            <div className="bold optionText">Drop device off at UPS Store</div>
            <div className="Row optionSubText">
              We'll email you a QR code. Show this code at the UPS Store and they'll package and ship your device at no cost.
            </div>
          </div>
        ),
        value: "UPSDrop-off_QRCode",
        ariaLabel: "Drop device off at UPS Store",
        className: "tradeRadiobutton",
      },
    ];
    shippingOptions.push(...shippingLabelAndQrOption);
  }

  if (visionCustomerType === "SL") {
    shippingOptions = shippingOptions.filter(option => option.value !== "tradeinLater");
  }

  if (
    getChannel()?.includes("OMNI-RETAIL") &&
    isIspuItemInCart &&
    customerType?.toLowerCase() !== "n"
  ) {
    const ispuOption = {
      name: "group",
      children: (
        <div className="Grid shippingOption u-paddingNone">
          <div className="bold optionText">
            Use the same return location as your In-store pickup location
          </div>
          <div className="Row optionSubText">
            <div>{props?.ispuStoreDetails?.[0] || ""}</div>
          </div>
        </div>
      ),
      value: "ReturnToIspuStore",
      ariaLabel: "Use the same return location as your In-store pickup location",
      className: "tradeRadiobutton",
    };
    shippingOptions = [ispuOption, ...shippingOptions];
  }

  if (preOrBackOrder || isIspuItemInCart || isEnabledTradeReturnOptionsInContactCenterApps) {
    shippingOptions = shippingOptions.filter(option => option.value !== "tradeinNow");
  }

  if (isEnabledTradeReturnOptionsInContactCenterApps && isMultiTrade) {
    shippingOptions = shippingOptions.filter(option => option.value !== "UPSDrop-off_QRCode");
  }

  return shippingOptions;
};

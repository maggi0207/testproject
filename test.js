import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Tooltip as VdsTooltip } from '@vds/tooltips';
import { RadioButtonGroup } from '@vds/radio-buttons';
import { Button, TextLinkCaret } from '@vds/buttons';
import moment from 'moment';
import { formatCurrency } from 'onevzsoemfecommon/Helpers/validation';
import StoreLocatorModal from './EditTradeIn/StoreLocatorModal';
import { useLazyGetStoreInformationQuery } from '../../modules/services/APIService/APIServiceHooks';
import { returnChoiceContinueBtn } from '../../utils/index';
const FixedHeader = styled(Grid)`
  margin: 0 !important;
  background-color: #f5f5f5;
  text-align: center;
  background: #ffffff;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 64rem;
  padding: 1.5rem 0.5rem;
  border-bottom: 1px solid #d3d3d3;
  top: 0;

  ${({ scmUpgradeMfeEnable }) =>
    scmUpgradeMfeEnable
      ? `
    position: sticky;
    top: 0;
     left :unset;
    border-bottom: 1px solid #d8dada;
  `
      : `
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
  `}
`;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0;
`;

const FixedHeader = styled(Grid)`
  margin: 0 !important;
  background-color: #f5f5f5;
  text-align: center;
  background: #ffffff;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 64rem;
  padding: 1.5rem 0.5rem;
  border-bottom: 1px solid #d3d3d3;
  top: 0;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const BackButton = styled.span`
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'verizon-icons', sans-serif !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  display: inline-block;
  cursor: pointer;
  &.Icon--left-caret {
    margin-right: 1rem;
  }
`;

const LargeTextBold = styled.span`
  font-size: 1.3125rem; // Example of text size
  font-weight: bold;
  margin-right: 1rem;
  padding-right: 1rem;
  border-right: 1px solid #000;
`;

const Font21Bold = styled.span`
  font-size: 21px;
  font-weight: bold;
`;

const TradeInTermsAndConditionsModal = styled.div`
  padding-top: 2rem;
  padding-bottom: 6rem;
`;

const ModalInner = styled.div`
  padding-top: 2rem;
`;

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 3rem !important;
`;

const FullWidthColumn = styled.div`
  width: 100%;
  padding-left: 6rem;
  padding-right: 3rem;
`;

const GridWithPaddingTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: 2rem;
`;

const Col = styled.div`
  flex-basis: ${(props) => (props.size ? `${props.size}%` : '100%')};
  padding: 0.5rem;
`;

const ReturnChoiceScreenHeading = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  padding-top: 1rem;
`;

const SecondaryText = styled.div`
  font-size: 14px;
  color: #555;
`;

const ItemCard = styled.div`
  padding: 2rem;
  background-color: #f6f6f6;
  margin-bottom: 1rem;
`;

const BoldText = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const SecondaryTitle = styled.div`
  font-size: 14px;
  color: #777;
`;

const Font20Bold = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const OptionSubTextStyle = styled.div`
  font-size: 1rem;
  width: 100%;
  padding-top: 0.5rem;
`;

const BoldSpan = styled.span`
  font-weight: bold;
`;

const Image = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  max-height: 125px;
  margin-top: 0;
  padding: 0;
  text-align: right;
`;

const RadioDiv = styled.div`
  & input[type=radio]+label::before, input[type=radio]:hover+label::before {
    content: "" !important;
    }
 }
`;

const FooterContainer = styled.div`
  text-align: center;
  background-color: #f5f5f5;
  border-top: 1px solid #d3d3d3;
  width: 64rem;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const FooterContent = styled.div`
  padding: 0.5rem 0;
  margin: 0 auto;
`;

const GridShippingOption = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  margin: 0 -8px;
  padding-left: 10px;
`;

const OptionText = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const OptionSubText = styled.div`
  position: relative;
  box-sizing: inherit;
  flex-basis: 100%;
  max-height: 100%;
  min-width: 0;
  padding: 8px 0;
  font-size: 1rem;
  width: 100%;
  font-family: 'BrandFont-Text', sans-serif;
`;

function ReturnChoiceScreen(props) {
  console.log('calling return', props);

  const [getStoreInformation, StoreInformationResult] = useLazyGetStoreInformationQuery();

  const [selectedShippingType, setSelectedShippingType] = useState(props?.selectedShippingType || false);
  const [currentStoreInformation, setCurrentStoreInformation] = useState(null);
  const [showStoreLocatorModal, setShowStoreLocatorModal] = useState(false);

  const fetchStoreInformation = (storeId) => {
    const request = {
      storeId,
    };
    getStoreInformation({ body: request, spinner: true });
  };

  useEffect(() => {
    if (StoreInformationResult?.isSuccess) {
      const response = StoreInformationResult?.data?.data;
      setCurrentStoreInformation(response?.storeInformation);
    }
  }, [StoreInformationResult]);

  useEffect(() => {
    fetchStoreInformation(props?.selectedStoreLocation?.preferredStoreId);
  }, [props?.selectedStoreLocation]);

  const getChannel = () => sessionStorage.getItem('channel') || '';

  const isMultiTrade = () => {
    const cartTradeInItems = props?.cartDetails?.lineDetails?.tradeInDetail?.tradeInItems || [];
    return cartTradeInItems?.length > 1;
  };

  const hideDeviceDetails = props.isFromEditTradein && isMultiTrade();

  const selectShippingType = (e) => {
    setSelectedShippingType(e.target.value);
  };

  const formatTodaysHours = (storeInformation) => {
    const days = ['hoursSun', 'hoursMon', 'hoursTue', 'hoursWed', 'hoursThu', 'hoursFri', 'hoursSat'];
    const today = days[moment().day()];
    const storeTimingsArray = storeInformation[`${today}`].split(' ');
    const storeTimings =
      storeTimingsArray.length === 4 &&
      `${storeTimingsArray[0]} ${storeTimingsArray[1]} to ${storeTimingsArray[2]} ${storeTimingsArray[3]}`;

    return storeTimings;
  };

  const toggleStoreLocatorModal = () => {
    setShowStoreLocatorModal((prevState) => !prevState);
  };

  const getShippingItemDetails = () => {
    const locationData = props?.selectedStoreLocation?.preferredStoreAddress || {};
    const storeName = locationData?.storeName || currentStoreInformation?.storeName;
    const storeAddressLine1 = locationData?.storeAddressLine1 || currentStoreInformation?.storeAddressLine1;
    const address1 = locationData?.address1 || currentStoreInformation?.address1;
    const city = locationData?.city || currentStoreInformation?.city;
    const state = locationData?.state || currentStoreInformation?.state;
    const storeDetailsText =
      storeName && (storeAddressLine1 || address1) && city && state
        ? `${storeName}, ${storeAddressLine1 || address1}, ${city}, ${state}`
        : "Just bring your devices and we'll take care of the rest. Find a qualified Verizon store near you.";
    const visionCustomerType = props?.cartDetails?.cartHeader?.visionCustomerType || '';

    return {
      locationData,
      storeName,
      storeAddressLine1,
      address1,
      city,
      state,
      storeDetailsText,
      visionCustomerType,
    };
  };

  //reference
  const returnOptions = () => {
    // List of all 4 return methods, the current return method is filtered out
    const { storeAddressLine1, address1, city, state, storeDetailsText, visionCustomerType } = getShippingItemDetails();
    const dropOffStoreText = props.isEnabledTradeReturnOptionsInContactCenterApps
      ? 'Bring device to a Verizon store'
      : 'Drop device off at Verizon store later';

    // const isMultiTrade = isMultiTrade();
    let shippingOptions = [
      {
        name: 'returnType',
        children: (
          <GridShippingOption className='u-paddingNone'>
            <OptionText>Trade-in device right now</OptionText>
            <OptionSubText>The trade-in device can be assessed and collected for processing in the store</OptionSubText>
          </GridShippingOption>
        ),
        value: 'tradeinNow',
        ariaLabel: 'Trade-in device right now',
        className: 'tradeRadiobutton',
      },
      {
        name: 'returnType',
        children: (
          <GridShippingOption className='u-paddingNone'>
            <OptionText>{dropOffStoreText}</OptionText>
            <OptionSubText>
              <div>
                {`${storeDetailsText}`}
                {currentStoreInformation && (
                  <VdsTooltip size='large' className='sg-tooltip'>
                    <span className='tooltipContent'>
                      <div className='bold'>Store details:</div>
                      <div>{currentStoreInformation?.storeName}</div>
                      <div>{`${storeAddressLine1 || address1}, ${city}, ${state}`}</div>
                      <div>Phone: {currentStoreInformation?.phoneNumber}</div>
                      <br />
                      <div>Today&apos;s hours:</div>
                      <div data-testid='storeInformationData'>{formatTodaysHours(currentStoreInformation)}</div>
                    </span>
                  </VdsTooltip>
                )}
              </div>
              <TextLinkCaret
                data-track='Edit location button'
                label='Edit location button'
                iconPos='right'
                icon='Icon Icon--right-caret'
                className='editLocationCTA bold pointer font-1rem color_black u-marginLeftLarge'
                data-testid='editLocationBtn'
                onClick={() => selectedShippingType === 'tradeinLater' && toggleStoreLocatorModal()}
              >
                Edit location
              </TextLinkCaret>
            </OptionSubText>
          </GridShippingOption>
        ),
        value: 'tradeinLater',
        ariaLabel: dropOffStoreText,
        className: 'tradeRadiobutton',
      },
    ];

    if (props.isEnabledTradeReturnOptionsInContactCenterApps) {
      const shippingLabelandQrOption = [
        {
          name: 'returnType',
          children: (
            <GridShippingOption className='u-paddingNone'>
              <OptionText>Print UPS shipping label and use my own box</OptionText>
              <OptionSubText>
                We'll email you a prepaid shipping label. Print it, attach it to your own box and bring it to a UPS drop
                off location.
              </OptionSubText>
            </GridShippingOption>
          ),
          value: 'PrepaidLabel',
          ariaLabel: 'Print UPS shipping label and use my own box',
          className: 'tradeRadiobutton',
        },
        {
          name: 'returnType',
          children: (
            <GridShippingOption className='u-paddingNone'>
              <OptionText>Drop device off at UPS Store</OptionText>
              <OptionSubText>
                We'll email you a QR code. Show this code at the UPS Store and they'll package and ship your device at
                no cost.
              </OptionSubText>
            </GridShippingOption>
          ),
          value: 'UPSDrop-off_QRCode',
          ariaLabel: 'Drop device off at UPS Store',
          className: 'tradeRadiobutton',
        },
      ];
      shippingOptions.push(...shippingLabelandQrOption);
    }
    if (visionCustomerType && visionCustomerType === 'SL') {
      shippingOptions = shippingOptions.filter(
        option => (option.value != "tradeinLater")
      )
    }

    // VZWYZDD-1412 - ISPU enable in Retail Changes
    if (getChannel()?.includes('OMNI-RETAIL') && props.isIspuItemInCart && props.customerType?.toLowerCase() !== 'n') {
      const ispuOption = {
        name: 'returnType',
        children: (
          <GridShippingOption className='u-paddingNone'>
            <OptionText>Use the same return location as your In-store pickup location</OptionText>
            <OptionSubText>
              <div>{`${props?.ispuStoreDetails?.[0] || ''}`}</div>
            </OptionSubText>
          </GridShippingOption>
        ),
        value: 'ReturnToIspuStore',
        ariaLabel: 'Use the same return location as your In-store pickup location',
        className: 'tradeRadiobutton',
      };
      shippingOptions = [ispuOption, ...shippingOptions];
    }

    if (props.preOrBackOrder || props.isIspuItemInCart || props.isEnabledTradeReturnOptionsInContactCenterApps) {
      shippingOptions = shippingOptions.filter((option) => option.value !== 'tradeinNow');
    }
    if (props.isEnabledTradeReturnOptionsInContactCenterApps && isMultiTrade) {
      shippingOptions = shippingOptions.filter((option) => option.value !== 'UPSDrop-off_QRCode');
    }

    return shippingOptions;
  };

  const continueButton = () => {
    console.log('continue button clicked', selectedShippingType);
    const locationData = props?.selectedStoreLocation?.preferredStoreAddress || {};
    if (
      selectedShippingType === 'tradeinNow' ||
      (selectedShippingType === 'tradeinLater' && locationData?.storeName) ||
      selectedShippingType === 'UPSDrop-off_QRCode' ||
      selectedShippingType === 'PrepaidLabel' ||
      selectedShippingType === 'ReturnToIspuStore'
    ) {
      returnChoiceContinueBtn(
        selectedShippingType,
        false,
        props.selectedStoreLocation,
        props.updateShippingType,
        props.returnChoiceHandler,
        props.fromPage,
        props.setTradeInLocation,
      );
    } else {
      toggleStoreLocatorModal();
    }
  };

  const footer = (
    <FooterContainer>
      <FooterContent>
        <Button
          data-testid='returnChoiceContinueBtn'
          disabled={!selectedShippingType}
          data-track='Continue'
          onClick={() => continueButton()}
        >
          Continue
        </Button>
      </FooterContent>
    </FooterContainer>
  );

  console.log('calling return choice', props);

  return (
    <div>
      <FixedHeader>
        <Header>
          <BackButton
            role='button'
            aria-label='back'
            onClick={() => props.hideReturnChoicePage()}
            onKeyPress={(e) => e.key === 'Enter' && props.hideReturnChoicePage()}
            className='Icon--left-caret u-alignMiddle'
            data-testid='returnChoiceBackBtn'
          />
          <LargeTextBold>{/* empty */}</LargeTextBold>
          <Font21Bold>{props.isFromEditTradein ? 'Edit trade return choice' : 'Trade-in'}</Font21Bold>
        </Header>
      </FixedHeader>

      <TradeInTermsAndConditionsModal>
        <ModalInner>
          <GridContainer>
            <FullWidthColumn>
              <GridWithPaddingTop data-testid='viewDetailsEnabled'>
                {isMultiTrade() && (
                  <>
                    <ReturnChoiceScreenHeading>Select trade return method</ReturnChoiceScreenHeading>
                    <SecondaryText>
                      Note : UPS QR code return option is not eligible for multiple trade-in orders
                    </SecondaryText>
                    <Col size={100}>
                      <Grid className='Grid--gapless u-flex'>
                        {props.multiDeviceDetails?.map((item) => (
                          <Col size={33}>
                            <ItemCard>
                              <BoldText>{item?.brand}</BoldText>
                              <SecondaryTitle>
                                {item?.size} {item?.color}
                              </SecondaryTitle>
                            </ItemCard>
                          </Col>
                        ))}
                      </Grid>
                    </Col>
                  </>
                )}
                {!hideDeviceDetails && (
                  <>
                    <ReturnChoiceScreenHeading>
                      {props.isFromEditTradein ? 'Select trade return method' : 'Trade-in device'}
                    </ReturnChoiceScreenHeading>
                    <Col size={50}>
                      <Image src={props?.device?.imageUrl || ''} />
                    </Col>
                    <Col size={50}>
                      <Font20Bold>
                        {props?.device &&
                          `${props.device?.brand} ${props.device?.displayName} ${props.device?.size} ${props.device?.color}`}
                      </Font20Bold>
                      <OptionSubTextStyle>
                        {props.device?.deviceId && `IMEI: ${props.device?.deviceId}`}
                      </OptionSubTextStyle>
                      <OptionSubTextStyle>
                        {'Appraised Trade-in value:'}{' '}
                        <BoldSpan>
                          {formatCurrency(
                            props.deviceOutInfo &&
                              props.deviceOutInfo.computedPrice !== undefined &&
                              props.deviceOutInfo.computedPrice !== ''
                              ? props.deviceOutInfo.computedPrice
                              : props.device && props.device.maxValue,
                          )}
                        </BoldSpan>
                      </OptionSubTextStyle>
                    </Col>
                  </>
                )}
              </GridWithPaddingTop>

              <RadioDiv>
                <RadioButtonGroup
                  onChange={selectShippingType}
                  data={returnOptions()}
                  defaultValue={selectedShippingType}
                />
              </RadioDiv>
            </FullWidthColumn>
          </GridContainer>

          {footer}
        </ModalInner>
      </TradeInTermsAndConditionsModal>

      {showStoreLocatorModal && (
        <StoreLocatorModal
          toggleStoreLocatorModal={toggleStoreLocatorModal}
          defaultZipCode={props.selectedStoreLocation?.preferredStoreAddress?.zipCode}
          updateStoreLocation={props.updateStoreLocation}
          isFromTradeinFlow={props?.isFromEditTradein}
          isFromEditTradein={props?.isFromEditTradein}
          cartTradeInType={props?.cartTradeInType}
          hideReturnChoicePage={props?.hideReturnChoicePage}
        />
      )}
    </div>
  );
}

export default ReturnChoiceScreen;

import React, { useState, useEffect } from 'react';
import { formatCurrency } from 'onevzsoemfecommon/Helpers/validation';
import { getUIContextPathBAU, getUIContextPath } from 'onevzsoemfecommon/Helpers';
import * as appMessageActions from 'onevzsoemfecommon/AppMessageActions';
import { Tooltip } from '@vds/tooltips';
import { Toggle } from '@vds/toggles';
import { Button, TextLinkCaret } from '@vds/buttons';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { returnChoiceContinueBtn } from '../../../utils';
import StoreLocatorModal from './StoreLocatorModal';
import ReturnChoiceScreen from '../ReturnChoiceScreen';

const EditTradeInContainer = styled.div``;

const BuyoutAmountModal = styled.div`
  z-index: 1000;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  overflow-y: scroll;
  background: #0a0a0a;
  ${({ showReturnChoiceScreen }) =>
    showReturnChoiceScreen &&
    `
    background-color: #ffffff !important;
  `}
`;

const EditTradeInBuyoutAmountModalInner = styled.div`
  position: absolute !important;
  width: 64rem !important;
  top: 0% !important;
  min-height: 100% !important;
  bottom: auto !important;
  margin: auto !important;
  left: 1% !important;
  right: 0% !important;
  background: #ffffff !important;
  border-top: 1px solid #d3d3d3;
`;

const EditTradeInHeaderContainer = styled.div`
  font-weight: 700 !important;
  font-family: BrandFontBold, Sans-serif !important;
  position: fixed;
  top: 0;
  z-index: 1;
  width: 100%;
  background-color: #ffffff;
`;

const FixedHeader = styled.div``;

const ItemDeviceIdContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  margin: 0 -8px;
  padding: 0;
  margin: 0;
`;

const EditTradeInImageContainer = styled.div`
  position: relative;
  box-sizing: inherit;
  flex-basis: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 0 8px 16px;
  flex-basis: 25%;
  max-width: 25%;
  padding-top: 1.3125rem !important;
  padding-right: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  padding-left: 1.3125rem !important;
  text-align: center !important;
`;

const EditTradeInImage = styled.img`
  max-width: 70%;
`;

const ColStyled = styled.div`
  position: relative;
  box-sizing: inherit;
  flex-basis: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 0 8px 16px;
  flex-basis: 75%;
  max-width: 75%;
  padding-top: 1.3125rem !important;
  padding-right: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  padding-left: 1.3125rem !important;
`;

const BoldPaddingBottom = styled.div`
  padding-bottom: 1.3125rem !important;
  font-weight: bold;
`;

const TriageInfoContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  margin: 0 -8px;
  padding: 0;
  border: 1px solid #d8dada !important;
  margin-top: 20px;
  margin-bottom: 20px;
  > div {
    width: 100%;
    display: flex;
  }
  > div:nth-child(odd) {
    background: #fff;
  }
`;

const Col = styled.div`
  position: relative;
  box-sizing: inherit;
  flex-basis: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 0 8px 16px;
`;

const Col10 = styled(Col)`
  flex-basis: 83.33333%;
  max-width: 83.33333%;
`;

const Col2 = styled(Col)`
  flex-basis: 16.66667%;
  max-width: 16.66667%;
`;

const LiteText = styled.span`
  font-family: BrandFontRegular, Sans-serif !important;
  font-weight: 400;
`;

const PaddingSmall = styled.div`
  padding-right: 0.4375rem !important;
`;

const FloatRightBold = styled.span`
  float: right;
  font-weight: bold;
`;

const Bold = styled.div`
  font-weight: bold;
`;

const ItemPrice = styled.div`
  padding-bottom: 1.3125rem !important;
  font-weight: bold;
  font-family: BrandFontRegular, Sans-serif !important;
  font-weight: 400;
`;

const PromoOfferId = styled.div`
  font-family: BrandFontRegular, Sans-serif !important;
  font-weight: 400;
  padding-bottom: 1.3125rem !important;
`;

const AccountTradeinType = styled.div`
  font-weight: 'bold';
  padding-bottom: 1.3125rem !important;
  border-top: 1px solid #d8dada;
  font-family: BrandFontRegular, Sans-serif !important;
  font-weight: 400;
  padding-top: 0.875rem !important;
`;

const BoldFlexLine = styled.div`
  font-weight: bold;
  padding-bottom: 1.3125rem !important;
  font-family: BrandFontRegular, Sans-serif !important;
  font-weight: 400;
  display: inline-flex !important;
`;

const ColAndCol3 = styled(Col)`
  flex-basis: 25%;
  max-width: 25%;
`;

const FilterDevicesContainer = styled(Col)`
  flex-basis: 75%;
  max-width: 75%;
  padding-top: 1.3125rem !important;
  padding-right: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  padding-left: 1.3125rem !important;
  border-top: 1px solid #d8dada;
  margin-top: 20px;
  margin-bottom: 20px;
`;
const UDisplayFlex = styled.div`
  display: flex !important;
`;

const JustifyContent = styled(UDisplayFlex)`
  justify-content: space-between;
`;

const EmptyDiv = styled.div`
  font-weight: bold;
  flex-basis: 83.33333%;
  max-width: 83.33333%;
  font-family: BrandFontRegular, Sans-serif !important;
  font-weight: 400;
  padding-bottom: 1.3125rem !important;
`;

const TradeInModalBody = styled.div`
  margin-top: 65px;
  margin-bottom: 65px !important;
  background-color: #fff;
  padding-top: 10px;
`;

const NoTradeIn = styled.div`
  text-align: center;
  width: 30%;
  margin: auto;
  top: 20vh;
  position: relative;
  font-size: 20px;
  line-height: 1.3;
`;

const TaxesFeesText = styled.div`
  font-weight: bold;
  position: absolute;
  bottom: 120px;
  left: 20px;
  marginbottom: 15px;
`;

const EditTradeInFooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #ffffff;
  text-align: center !important;
`;

const HeaderInnerDiv = styled.div`
  padding-top: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  border-bottom: 1px solid #d8dada;

  position: fixed;
  top: 0;
  width: 64rem;
  background: #ffffff;
`;

const UFloatLeft = styled.div`
  float: left;
`;

const HideEditBtn = styled.span`
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

  display: inline-block !important;
  padding-right: 0.875rem !important;
  border-right: 1px solid #000000;
`;

const DeviceTradeInText = styled.span`
  padding-left: 0.875rem !important;
  font-weight: 700 !important;
  font-family: BrandFontBold, Sans-serif !important;
  font-size: 18px;
`;

const DeviceHistoryFooter = styled.div`
  position: fixed;
  bottom: 0;
  width: 64rem;
  background: #ffffff;
  border-top: 1px solid #d8dada;
`;

const DeviceHistoryFooterInner = styled.div`
  text-align: center !important;
  padding-top: 1.3125rem !important;
  padding-right: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  padding-left: 1.3125rem !important;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const UPaddingLeftMedium = styled.span`
  padding-left: 0.875rem !important;
`;

const DoneButton = styled(Button)`
  font-size: 14px;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  width: 25% !important;
`;

const TradeMoreDevicesBtn = styled(Button)`
  font-size: 14px;
  width: 25% !important;
  color: #000000 !important;
  margin-top: 0 !important;
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  margin-left: 0 !important;
`;

const GridAndGapless = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: row wrap;
  margin: 0 -8px;
  padding: 0;
`;

const ColCol6AndPaddingLarge = styled.div`
  position: relative;
  box-sizing: inherit;
  flex-basis: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 0 8px 16px;
  flex-basis: 50%;
  max-width: 50%;
  padding-top: 1.3125rem !important;
  padding-right: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  padding-left: 1.3125rem !important;
`;

const TradeAnywhereToggle = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const TradeDeviceLater = styled.div`
  font-weight: bold;
  padding-right: 0.875rem !important;
  padding-left: 0.875rem !important;
`;

const FloatRight = styled.div`
  float: right;
`;

const ColCol12AndPaddingLarge = styled.div`
  position: relative;
  box-sizing: inherit;
  flex-basis: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 0 8px 16px;
  flex-basis: 100%;
  max-width: 100%;
  padding-top: 1.3125rem !important;
  padding-right: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  padding-left: 1.3125rem !important;
`;

const Fmi = styled.p`
  width: 200px;
  right: 150px;
  color: #ffa500;
  position: absolute;
  top: 18px;
`;
let navigate = '';
function useNavigateMFE() {
  navigate = useNavigate();
}
function EditTradeIn(props) {
  try {
    useNavigateMFE();
  } catch (e) {
    /* istanbul ignore next */
    console.log('');
  }

  const [showToggle, setShowToggle] = useState(null);
  const [showAnywhereToggle, setShowAnywhereToggle] = useState(null);
  const [switchAnywhereValue, setSwitchAnywhereValue] = useState(null);
  const [switchValue, setSwitchValue] = useState('');
  const [tradeInType, setTradeInType] = useState('');
  const [triage, setTriage] = useState([]);
  const [tradeInShippingType, setTradeInShippingType] = useState('');
  const [showStoreLocatorModal, setShowStoreLocatorModal] = useState(props?.showStoreLocatorModal || false);

  const [tradeInLocation, setTradeInLocation] = useState('Home');

  const locationData = JSON.parse(sessionStorage.getItem('locationData')) || '';
  const locationId = sessionStorage.getItem('location') || '';
  const [selectedStoreLocation, setSelectedStoreLocation] = useState({
    preferredStoreId: locationId,
    preferredStoreAddress: locationData,
  });

  const { cartDetails } = props;

  const tradeInItems = [].concat(props.tradeInDueMonthlyItems, props.tradeInDueTodayItems);

  const orderList = cartDetails?.orderDetails?.orderList || [];
  const editTradeIn = orderList && orderList.find((activity) => activity.orderActivityType === 'TIN');

  const getCartItems = () => {
    if (!cartDetails || !cartDetails?.lineDetails || !cartDetails?.lineDetails?.lineInfo) {
      return [];
    }
    const lineInfo = cartDetails.lineDetails.lineInfo;
    return lineInfo
      .map((line) => (line.itemsInfo ? line.itemsInfo.map((item) => item.cartItems || null) : null))
      .flat()
      .filter((item) => item !== null);
  };

  const cartItems = getCartItems();
  const filteredDevices = [];

  let creditForActivationfee;
  let creditForActivationfee_taxSurcharge;

  if (cartItems && cartItems.length > 0) {
    cartItems.forEach((items) => {
      /* istanbul ignore else */
      if (items && items.cartItem && items.cartItem.length > 0) {
        items.cartItem.forEach((item) => {
          if (
            (item.cartItemType.toLowerCase() === 'device' &&
              (item.instantCreditAmountUsed > 0 || item.instantCreditAmountUsedForTaxes > 0)) ||
            (item.cartItemType.toLowerCase() === 'accessory' &&
              (item.instantCreditAmountUsed > 0 || item.instantCreditAmountUsedForTaxes > 0))
          ) {
            filteredDevices.push(item);
          } else if (
            item.cartItemType === 'ACTIVATION_FEE' &&
            (item.instantCreditAmountUsed > 0 || item.instantCreditAmountUsedForTaxes > 0)
          ) {
            creditForActivationfee = item.instantCreditAmountUsed;
            creditForActivationfee_taxSurcharge = item.instantCreditAmountUsedForTaxes;
          }
        });
      }
    });
  }

  const { ShowCreditChangesForHyla = 'FALSE' } = Object.keys(props?.assistedFlags)?.length > 0 && props.assistedFlags;

  const tradeInDetails = cartDetails?.lineDetails?.tradeInDetail || [];

  const handleButtons = () => {
    let disableEditButtons = false;
    const status = cartDetails?.cartHeader && cartDetails?.cartHeader?.status;
    const orderStatus = '';
    /* istanbul ignore next */
    if (orderStatus === 'CR' && status !== 'P' && status !== 'C') {
      disableEditButtons = true;
    }

    return disableEditButtons;
  };

  const hasToDisableEditLinks = handleButtons();
  const enableTradeInRestriction = props.assistedFlags.restrictOneTradePerOrder === 'TRUE';
  const appPropertiesFromSessionStorage = JSON.parse(sessionStorage.getItem('APP_PROPERTIES'));
  const disableTradeinManipulationAfterOrderSubmission = !!(
    appPropertiesFromSessionStorage?.disableTradeinManipulationAfterOrderSubmission?.toLowerCase() === 'true'
  );
  const customerType = props?.customerInfo?.customerAttributes?.customerType;
  const getChannel = () => sessionStorage.getItem('channel') || '';
  const isCostcoAgent =
    props?.customerInfo?.locationSubType === 'RX' ||
    props?.customerInfo?.locationSubType === 'GN' ||
    cartDetails?.cartHeader?.isCostcoAgent ||
    false;
  // const enableReturnOptionsInContactCenterApps = isEnabledTradeReturnOptionsInContactCenterApps(props.showTradeAnywhereForBEWithoutEcpdCustomers, isCostcoAgent) && (!isSDDInCart(props));
  const instantCreditEligible = cartDetails?.lineDetails?.tradeInDetail?.instantCreditEligible || false;
  const giftCardTradeInType = 'Gift Card for Trade-in Value';
  const accountTradeinType = 'Account Credit for Trade-in Value';
  const returnMethodMapping = {
    return_store: 'Drop the device at store later',
    PrepaidLabel: 'Print UPS shipping label and use my own box',
    'UPSDrop-off_QRCode': 'UPS QR code',
  };

  const updateStoreInfoFromCart = () => {
    const splitedValues = props?.tradeInItems?.[0]?.preferredStoreAddress?.split(',');

    const address = Object.keys(selectedStoreLocation?.preferredStoreAddress).includes('storeAddressLine1')
      ? 'storeAddressLine1'
      : 'address1';

    if (splitedValues?.length > 0) {
      setSelectedStoreLocation((prevLocation) => ({
        ...prevLocation,
        preferredStoreId: props?.tradeInItems?.[0]?.preferredStoreId,
        preferredStoreAddress: {
          ...prevLocation.preferredStoreAddress,
          storeName: splitedValues?.[0] || '',
          [address]: splitedValues?.[1] || '',
          city: splitedValues?.[2] || '',
          state: splitedValues?.[3] || '',
        },
      }));
    } else {
      setSelectedStoreLocation({ preferredStoreId: locationId, preferredStoreAddress: locationData });
    }
  };

  let tradeInTypeFromCart = cartDetails?.lineDetails?.tradeInDetail?.tradeInType || null;
  let tradeInShippingTypeFromCart = cartDetails?.lineDetails?.tradeInDetail?.tradeInShippingType || null;
  let preOrBackOrder = false;
  let isIspuItemInCart = false;

  const returnMethod = returnMethodMapping[tradeInShippingTypeFromCart] || '';

  console.log(returnMethod);

  const setintState = () => {
    if (props.tradeInItems && props.tradeInItems.length >= 5) {
      appMessageActions.addAppMessage('Maximum 5 devices per order', 'error');
    }

    const enableEditTradeinPauseAndResumeChanges = !!(
      appPropertiesFromSessionStorage?.enableEditTradeinPauseAndResumeChanges?.toLowerCase() === 'true'
    );

    const enableReturnOptionsForNewCustomerInRetail =
      appPropertiesFromSessionStorage?.enableReturnOptionsForNewCustomerInRetail?.toLowerCase() === 'true';

    const isEnabledReturnChoicesForNewCustomerInRetail =
      enableReturnOptionsForNewCustomerInRetail && customerType?.toLowerCase() === 'n';

    const enableIspuwithTradeInRetail =
      appPropertiesFromSessionStorage?.enableIspuwithTradeInRetail?.toLowerCase() === 'true';

    const enableTradeReturnChanges =
      props?.enableReturnAnywhereAssisted &&
      (customerType?.toLowerCase() !== 'n' || isEnabledReturnChoicesForNewCustomerInRetail) &&
      props?.showTradeAnywhereForBEWithoutEcpdCustomers;

    tradeInTypeFromCart = cartDetails?.lineDetails?.tradeInDetail?.tradeInType || null;

    tradeInShippingTypeFromCart = cartDetails?.lineDetails?.tradeInDetail?.tradeInShippingType || null;

    // Check for stand alone trade-in
    let standAoneTradeIn = true;
    const lineInfo = cartDetails?.lineDetails?.lineInfo || [];
    for (const i in lineInfo) {
      let itemsInfo = lineInfo[i]?.itemsInfo ? lineInfo[i]?.itemsInfo : [];
      itemsInfo = itemsInfo?.length > 0 ? itemsInfo[0] : {};
      const cartItem =
        itemsInfo && itemsInfo?.cartItems && itemsInfo?.cartItems?.cartItem ? itemsInfo?.cartItems?.cartItem : [];
      const getIndex = cartItem?.findIndex((x) => x?.cartItemType === 'DEVICE');
      if (getIndex >= 0) {
        standAoneTradeIn = false;
      }
    }

    cartDetails?.lineDetails?.lineInfo?.forEach((line) => {
      if (line?.preOrBackOrder) {
        preOrBackOrder = true;
      }
      if (line?.ispuItem) {
        isIspuItemInCart = true;
      }
    });

    let stopIsputoToggle = false;
    if (
      getChannel() &&
      getChannel().includes('RETAIL') &&
      enableIspuwithTradeInRetail &&
      customerType?.toLowerCase() !== 'n' &&
      isIspuItemInCart
    ) {
      stopIsputoToggle = true;
    }
    /* istanbul ignore else */
    if (showToggle === null) {
      if (
        props?.customerInfo?.channel?.indexOf('OMNI-RETAIL') > -1 &&
        !standAoneTradeIn &&
        !preOrBackOrder &&
        !enableTradeReturnChanges &&
        !stopIsputoToggle
      ) {
        setShowToggle(true);
      }
    }

    if (showAnywhereToggle === null) {
      if (
        props?.customerInfo?.channel?.includes('OMNI-RETAIL') &&
        enableTradeReturnChanges &&
        !preOrBackOrder &&
        !props.fromOrderReview &&
        !isCostcoAgent &&
        !stopIsputoToggle
      ) {
        /* istanbul ignore else */
        if (
          (enableEditTradeinPauseAndResumeChanges && !props.landing?.resumeCaseCalled) ||
          !enableEditTradeinPauseAndResumeChanges
        ) {
          setShowAnywhereToggle(true);
        }
      }
    }

    updateStoreInfoFromCart();
  };

  useEffect(() => {
    const { enableReturnAnywhereAssisted, showTradeAnywhereForBEWithoutEcpdCustomers } = props;

    const enableTradeReturnChanges =
      enableReturnAnywhereAssisted && customerType?.toLowerCase() !== 'n' && showTradeAnywhereForBEWithoutEcpdCustomers;

    const tradeInTypeFromNextProps = cartDetails?.lineDetails?.tradeInDetail?.tradeInType || null;

    if (!enableTradeReturnChanges) {
      setintState();
    }

    if (enableTradeReturnChanges || props?.enableReturnOptionsInContactCenterApps) {
      appMessageActions.clearAppMessages();

      const currentTradeInShippingType = cartDetails?.lineDetails?.tradeInDetail?.tradeInShippingType || null;

      if (
        tradeInTypeFromNextProps?.toLowerCase() === 'home' &&
        currentTradeInShippingType?.toLowerCase() === 'return_store'
      ) {
        setSwitchAnywhereValue(true);
        setTradeInType(tradeInTypeFromNextProps);
        setTradeInShippingType(currentTradeInShippingType);
        appMessageActions.addAppMessage('Trade return method changed to Trade later', 'success', true, true, true);
      } else if (tradeInTypeFromNextProps?.toLowerCase() === 'store') {
        setSwitchAnywhereValue(false);
        setTradeInType(tradeInTypeFromNextProps);
        setTradeInShippingType(currentTradeInShippingType);
        appMessageActions.addAppMessage('Trade return method changed to Trade now', 'success', true, true, true);
      } else if (currentTradeInShippingType?.toLowerCase() === 'prepaidlabel') {
        appMessageActions.addAppMessage(
          'Trade return method changed to Print UPS shipping label',
          'success',
          true,
          true,
          true,
        );
      } else if (currentTradeInShippingType?.toLowerCase() === 'upsdrop-off_qrcode') {
        appMessageActions.addAppMessage('Trade return method changed to UPS QR code', 'success', true, true, true);
      }

      setintState();
    }
  }, [cartDetails?.lineDetails?.tradeInDetail]);

  useEffect(() => {
    setintState();
  }, []);

  useEffect(() => {
    if (showToggle && switchValue === '' && tradeInTypeFromCart) {
      if (tradeInTypeFromCart === 'Home') {
        setSwitchValue('Y');
        setTradeInType(tradeInTypeFromCart);
      } else {
        setSwitchValue('N');
        setTradeInType(tradeInTypeFromCart);
      }
    }
  }, [showToggle]);

  useEffect(() => {
    if (showAnywhereToggle && tradeInTypeFromCart) {
      if (
        tradeInTypeFromCart?.toLowerCase() === 'home' &&
        tradeInShippingTypeFromCart?.toLowerCase() === 'return_store'
      ) {
        setSwitchAnywhereValue(true);
        setTradeInType(tradeInTypeFromCart);
        setTradeInShippingType(tradeInShippingTypeFromCart);
      } else {
        setSwitchAnywhereValue(false);
        setTradeInType(tradeInTypeFromCart);
        setTradeInShippingType(tradeInShippingTypeFromCart);
      }
    }
  }, [showAnywhereToggle]);

  useEffect(() => {
    const tempTriage = new Array(tradeInItems?.length).fill({ isShow: false });
    setTriage(tempTriage);
    setTradeInType(cartDetails?.lineDetails?.tradeInDetail?.tradeInType);
  }, [cartDetails?.lineDetails?.tradeInDetail]);

  const handleToggle = () => {
    let tradeInTypeValue = '';
    if (tradeInType === 'Home') {
      tradeInTypeValue = 'Store';
    } else if (tradeInType === 'Store') {
      /* istanbul ignore else */
      tradeInTypeValue = 'Home';
    }

    const payload = {
      tradeInType: tradeInTypeValue,
    };

    props.cartTradeInTypeHelper(payload);
  };

  const handleAnywhereToggle = () => {
    if (tradeInType?.toLowerCase() === 'home' && tradeInShippingType?.toLowerCase() === 'return_store') {
      const payload = {
        cartId: props.landing?.customer?.cartId,
        intendType: 'AAL',
        tradeInType: 'Store',
        itemType: 'TRADEINTYPE',
      };
      props.cartTradeInTypeHelper(payload);
    } else if (tradeInType?.toLowerCase() === 'store') {
      /* istanbul ignore else */
      setSwitchAnywhereValue(false);
      toggleStoreLocatorModal();
    }
  };

  const showTriageDetails = (index) => {
    const updatedTriage = [...triage];
    /* istanbul ignore else */
    if (index >= 0) {
      updatedTriage?.splice(index, 1, { isShow: !triage?.[index]?.isShow });
    }
    setTriage(updatedTriage);
  };

  const removeTradeIn = (deviceId) => {
    const payload = {
      id: deviceId,
    };
    props.removeTradeInRequest(payload);
  };

  // const changeReturnMethod = () => {
  //   updateStoreInfoFromCart();
  //   props?.setShowReturnChoiceScreen(true);
  // }

  const addDeviceId = (submissionId) => {
    const cradleProps = appPropertiesFromSessionStorage;
    const assistedFlagStorge = sessionStorage.getItem('assistedFlags');
    const assistedFlagsSessionStorage = JSON.parse(assistedFlagStorge || '{}');
    const isTradeinMFEFlowEnabled = /true/i.test(cradleProps?.isTradeinMFEFlowEnabled);
    const isTradeinMFEFlowAssistedEnabled = /true/i.test(assistedFlagsSessionStorage?.isTradeinMFEFlowEnabled);

    const url = `/sales/assisted/new/trade-in.html?submissionId=${submissionId}`;
    if (isTradeinMFEFlowEnabled || isTradeinMFEFlowAssistedEnabled) {
      window.location.href = url;
    } else {
      navigate(`${getUIContextPath()}/shop-tradein.html?submissionId=${submissionId}`);
    }
  };

  const EditTradeInHeader = (
    <FixedHeader className='u-colorBackgroundSecondary'>
      <HeaderInnerDiv className='u-floatClearFix'>
        <UFloatLeft>
          <HideEditBtn
            data-testid='hideEditBtn'
            onClick={() => {
              props.hideEditTradeIn();
            }}
            className='Icon--left-caret u-alignMiddle'
            tabIndex='0'
            aria-label='back'
            role='button'
            onKeyPress={(e) => e.key === 'Enter' && props.hideEditTradeIn()}
          />
          <DeviceTradeInText>Device trade in</DeviceTradeInText>
        </UFloatLeft>
      </HeaderInnerDiv>
    </FixedHeader>
  );

  const EditTradeInBody = (
    <>
      {/* {props?.enableReturnOptionsInContactCenterApps && (
        <div className="Grid Grid--gapless">
          <div className="Col Col--8 u-paddingAllLarge bold">Return method: <span className="lite">{returnMethod}</span></div>
          {(!props?.fromOrderReview && returnMethod !== "Trade at home") && (
            <div className="Col Col--4 u-paddingAllLarge float_right">
            <Button  data-track="Change return method"
                    label="Change return method"
                    iconPos="right"
                    icon="Icon Icon--right-caret"
                    data-testid="changeReturnMethod"
                    className="u-marginLeftNone shopLink bold u-floatRight"
                    onClick={() => {changeReturnMethod()}}
                  >Change return method</Button>
            </div>
          )}
        </div>
      )} */}

      {showToggle && !props?.enableReturnOptionsInContactCenterApps && (
        <GridAndGapless>
          {props?.isAcctICEligible ? (
            <ColCol6AndPaddingLarge>Trade at home and receive instant credit</ColCol6AndPaddingLarge>
          ) : (
            <ColCol6AndPaddingLarge>Trade at home</ColCol6AndPaddingLarge>
          )}
          {tradeInLocation === 'Home' && editTradeIn && editTradeIn?.orderActivityType === 'TIN' ? (
            ''
          ) : (
            <ColCol6AndPaddingLarge>
              <FloatRight>
                <Toggle
                  ariaLabel='tradeSwitch'
                  value={switchValue}
                  onChange={() => handleToggle()}
                  on={tradeInTypeFromCart === 'Home'}
                />
              </FloatRight>
            </ColCol6AndPaddingLarge>
          )}
          {tradeInLocation === 'Home' && editTradeIn && editTradeIn?.orderActivityType === 'TIN' ? (
            <ColCol12AndPaddingLarge>
              Editing trade is not allowed after an order is created. If you need to make changes to trade, please
              create a new order with trade.
            </ColCol12AndPaddingLarge>
          ) : (
            ''
          )}
        </GridAndGapless>
      )}

      {(disableTradeinManipulationAfterOrderSubmission && cartDetails?.cartHeader?.status?.toLowerCase() === 's') ||
      props?.enableReturnOptionsInContactCenterApps
        ? ''
        : showAnywhereToggle && (
            <GridAndGapless>
              <ColCol6AndPaddingLarge />
              {tradeInLocation === 'Home' && editTradeIn && editTradeIn?.orderActivityType === 'TIN' ? (
                ''
              ) : (
                <ColCol6AndPaddingLarge>
                  <TradeAnywhereToggle>
                    <Toggle
                      ariaLabel='tradeAnywhereSwitch'
                      value={switchAnywhereValue}
                      onChange={() => handleAnywhereToggle()}
                      on={
                        tradeInType?.toLowerCase() === 'home' && tradeInShippingType?.toLowerCase() === 'return_store'
                      }
                    />
                    <TradeDeviceLater>Trade the device later</TradeDeviceLater>
                  </TradeAnywhereToggle>
                </ColCol6AndPaddingLarge>
              )}
            </GridAndGapless>
          )}

      {tradeInItems?.map(
        (item, index) =>
          item && (
            <ItemDeviceIdContainer key={item.deviceId}>
              <EditTradeInImageContainer>
                <EditTradeInImage src={item.imgUrl} alt='edit' />
              </EditTradeInImageContainer>

              <ColStyled>
                <BoldPaddingBottom>
                  <span dangerouslySetInnerHTML={{ __html: item.equipModel }} />
                </BoldPaddingBottom>

                {item?.triageInfo &&
                  item.triageInfo.triage &&
                  item.triageInfo.triage
                    .filter((triageItem) => triageItem.triageAnswer === 'NO' && triageItem.triageQuestionId === '7')
                    ?.map(() => <Fmi>Find My iPhone is enabled</Fmi>)}

                {item.tradeInStatus === 'Appraised' ? ( // && tradeNoDeviceEnabled recheck
                  <TextLinkCaret
                    type='button'
                    data-track='Add Device Id'
                    label='Add Device Id'
                    iconPos='right'
                    icon='Icon Icon--right-caret'
                    className='u-marginLeftNone shopLink bold'
                    onClick={() => {
                      addDeviceId(item.submissionId);
                    }}
                  >
                    Add Device Id
                  </TextLinkCaret>
                ) : (
                  <BoldPaddingBottom>
                    Device Id: <LiteText>{item.deviceId}</LiteText>
                  </BoldPaddingBottom>
                )}

                <BoldPaddingBottom>
                  <TextLinkCaret
                    data-track='Triage Details'
                    label='Triage Details'
                    iconPos='right'
                    data-testid='triagedetails'
                    className='u-marginLeftNone shopLink bold u-floatRight'
                    onClick={() => showTriageDetails(index)}
                  >
                    Triage Details
                  </TextLinkCaret>
                </BoldPaddingBottom>

                {item?.triageInfo &&
                  item.triageInfo.triage &&
                  item.triageInfo.triage.length > 0 &&
                  triage[index] &&
                  triage[index].isShow && (
                    <TriageInfoContainer>
                      {item.triageInfo.triage.map(
                        (item1) =>
                          item1 && (
                            <div>
                              <Col10>
                                <PaddingSmall>
                                  <LiteText>{item1.questionText}</LiteText>
                                </PaddingSmall>
                              </Col10>
                              <Col2>
                                <PaddingSmall>
                                  <FloatRightBold>
                                    {item1.triageAnswer && item1.triageAnswer === 'YES' ? 'Y' : 'N'}
                                  </FloatRightBold>
                                </PaddingSmall>
                              </Col2>
                            </div>
                          ),
                      )}
                    </TriageInfoContainer>
                  )}

                {item?.tradeInDueToday && (
                  <ItemPrice>
                    {cartDetails?.cartHeader?.cartCreatorChannelId === 'OMNI-INDIRECT' &&
                    ShowCreditChangesForHyla === 'TRUE'
                      ? 'Total trade in value'
                      : 'Total trade in credit'}
                    <FloatRightBold>{formatCurrency(item?.itemPrice)}</FloatRightBold>
                  </ItemPrice>
                )}

                {!item?.tradeInDueToday && (
                  <Bold>
                    {formatCurrency(item?.itemPrice)}/mo credit for {item?.recycleDeviceOffer?.bicCreditDpTerm} months
                  </Bold>
                )}

                {item?.recycleDeviceOffer?.offerId && (
                  <PromoOfferId>
                    {`Promo ${item?.recycleDeviceOffer?.offerId} - ${
                      item?.recycleDeviceOffer?.offerDesc
                    } - ${formatCurrency(item?.recycleDeviceOffer?.discAmt)}`}
                  </PromoOfferId>
                )}

                {item.itemPrice &&
                  (!instantCreditEligible ||
                    (cartDetails?.cartHeader?.cartCreatorChannelId === 'OMNI-INDIRECT' &&
                      ShowCreditChangesForHyla === 'TRUE')) && (
                    <div>
                      {item?.creditType === 'ACT' ? (
                        <AccountTradeinType>
                          {cartDetails?.cartHeader?.cartCreatorChannelId === 'OMNI-INDIRECT' &&
                          ShowCreditChangesForHyla === 'TRUE' ? (
                            <span>
                              Value available for Trade-In
                              <span style={{ top: '4px', position: 'relative' }}>
                                <Tooltip size='medium' iconFillColor='#1388EF' surface='light'>
                                  Trade Value can vary, amounts may have been applied via in-store purchase credit AND /
                                  OR account credit
                                </Tooltip>
                              </span>
                            </span>
                          ) : (
                            accountTradeinType
                          )}
                          <FloatRightBold>{formatCurrency(item.itemPrice)}</FloatRightBold>
                        </AccountTradeinType>
                      ) : (
                        ''
                      )}
                      {item?.creditType === 'GFT' ? (
                        <AccountTradeinType>
                          {giftCardTradeInType}
                          <FloatRightBold>{formatCurrency(item.itemPrice)}</FloatRightBold>
                        </AccountTradeinType>
                      ) : (
                        ''
                      )}
                    </div>
                  )}

                {disableTradeinManipulationAfterOrderSubmission &&
                (cartDetails?.cartHeader?.cartCreatorChannelId === 'OMNI-RETAIL' ||
                  cartDetails?.cartHeader?.cartCreatorChannelId === 'OMNI-RETAIL-TAB') &&
                cartDetails?.cartHeader?.status?.toLowerCase() === 's'
                  ? ''
                  : (!props.readOrder || (props.readOrder && hasToDisableEditLinks)) && (
                      <div className='bold u-paddingBottomLarge'>
                        {tradeInLocation === 'Home' && editTradeIn && editTradeIn?.orderActivityType === 'TIN' ? (
                          ''
                        ) : (
                          <TextLinkCaret
                            data-track='Remove'
                            data-testid='removeDeviceBtn'
                            label='Remove'
                            iconPos='right'
                            icon='Icon Icon--right-caret'
                            className={
                              props?.landing?.fetchPricingOnLoad
                                ? 'u-marginLeftNone shopLink bold u-floatRight removeButtonDisable'
                                : 'u-marginLeftNone shopLink bold u-floatRight'
                            }
                            onClick={() => {
                              removeTradeIn(item.deviceId);
                            }}
                          >
                            Remove
                          </TextLinkCaret>
                        )}
                      </div>
                    )}
              </ColStyled>
            </ItemDeviceIdContainer>
          ),
      )}

      <UDisplayFlex>
        <ColAndCol3 />
        <FilterDevicesContainer>
          {filteredDevices &&
            filteredDevices.length > 0 &&
            filteredDevices.map((item) => (
              <div>
                {item && item.instantCreditAmountUsedForTaxes > 0 && (
                  <JustifyContent>
                    <EmptyDiv
                      dangerouslySetInnerHTML={{
                        __html: `${'Credit towards item price on'} ${item?.manufacturer || ''} ${item?.description ? `&nbsp;${item.description}` : ''} ${item?.capacity || ''}`,
                      }}
                    />
                    <Bold>{formatCurrency(item.instantCreditAmountUsedForTaxes)}</Bold>
                  </JustifyContent>
                )}

                {item && item.instantCreditAmountUsed > 0 && (
                  <JustifyContent>
                    <EmptyDiv
                      dangerouslySetInnerHTML={{
                        __html: `${'Credit towards item price on'} ${item?.manufacturer || ''} ${item?.description ? `&nbsp;${item.description}` : ''} ${item?.capacity || ''}`,
                      }}
                    />
                    <FloatRightBold>{formatCurrency(item.instantCreditAmountUsed)}</FloatRightBold>
                  </JustifyContent>
                )}
              </div>
            ))}

          {tradeInDetails &&
            tradeInDetails.instantCreditAmountRemaining > 0 &&
            !(
              cartDetails?.cartHeader?.cartCreatorChannelId === 'OMNI-INDIRECT' && ShowCreditChangesForHyla === 'TRUE'
            ) && (
              <div>
                <BoldFlexLine>Credit towards customer account</BoldFlexLine>
                <FloatRightBold>{formatCurrency(tradeInDetails.instantCreditAmountRemaining)}</FloatRightBold>
              </div>
            )}

          {creditForActivationfee && creditForActivationfee > 0 && (
            <div>
              <BoldFlexLine>Credit towards Activation fee</BoldFlexLine>
              <FloatRightBold>{formatCurrency(creditForActivationfee)}</FloatRightBold>
            </div>
          )}

          {creditForActivationfee_taxSurcharge && creditForActivationfee_taxSurcharge > 0 && (
            <div>
              <BoldFlexLine>Credit towards Activation fee taxes and surcharges</BoldFlexLine>
              <FloatRightBold>{formatCurrency(creditForActivationfee_taxSurcharge)}</FloatRightBold>
            </div>
          )}
        </FilterDevicesContainer>
      </UDisplayFlex>
    </>
  );
//window?.mfe?.historyRef.push(`${acssMfeBasePath}/shop-tradein.html`);
  const EditTradeInFooter = (
    <DeviceHistoryFooter>
      <DeviceHistoryFooterInner>
        <DoneButton data-track='Done' onClick={props.hideEditTradeIn}>
          Done
        </DoneButton>

        {(!props.readOrder && !enableTradeInRestriction) || (props.readOrder && hasToDisableEditLinks) ? (
          <TradeMoreDevicesBtn
            data-track='Trade in more devices'
            className='u-colorBackgroundSecondary'
            onClick={() => navigate(`${getUIContextPathBAU()}/shop-tradein.html`)}
            disabled={props && props.tradeInItems && props.tradeInItems.length >= 5}
          >
            Trade in more devices
          </TradeMoreDevicesBtn>
        ) : (
          ''
        )}

        <UPaddingLeftMedium />
      </DeviceHistoryFooterInner>
    </DeviceHistoryFooter>
  );

  const toggleStoreLocatorModal = () => {
    /* istanbul ignore else */
    if (!showStoreLocatorModal) {
      setintState();
    }
    setShowStoreLocatorModal((prevState) => !prevState);
  };

  const device = {
    imageUrl: tradeInItems?.[0]?.imgUrl,
    deviceId: tradeInItems?.[0]?.deviceId,
    brand: tradeInItems?.[0]?.equipMake,
    displayName: tradeInItems?.[0]?.equipCategory,
    size: tradeInItems?.[0]?.size,
    color: tradeInItems?.[0]?.color,
  };

  const multiDeviceDetails = tradeInItems?.map((item) => ({
    brand: `${item?.equipMake} ${item?.equipCategory}`,
    size: item?.size,
    color: item?.color,
  }));

  const removeTradeinShippingType = !!(
    (cartDetails?.lineDetails?.tradeInDetail?.tradeInItems?.length > 1 &&
      tradeInShippingTypeFromCart === 'UPSDrop-off_QRCode') ||
    props.removeTradeinShippingType
  );
  // const selectedShippingType = removeTradeinShippingType ? "" : tradeInShippingTypeFromCart === "return_store" ? "tradeinLater" : tradeInShippingTypeFromCart;
  let selectedShippingType = '';
  /* istanbul ignore else */
  if (!removeTradeinShippingType) {
    if (tradeInShippingTypeFromCart === 'return_store') {
      selectedShippingType = 'tradeinLater';
    } else {
      selectedShippingType = tradeInShippingTypeFromCart;
    }
  }

  const hideReturnChoicePage = () => {
    props?.setShowReturnChoiceScreen(false);
    /* istanbul ignore else */
    if (props?.showReturnChoiceScreen) {
      props?.hideEditTradeIn();
    }
  };

  const updateShippingType = (data) => {
    let payload;
    if (data === 'return_store') {
      payload = {
        tradeInType: 'Home',
        tradeInShippingType: 'return_store',
        preferredStoreId: selectedStoreLocation?.preferredStoreId,
        preferredStoreAddress: `${selectedStoreLocation?.preferredStoreAddress?.storeName}, ${selectedStoreLocation?.preferredStoreAddress?.storeAddressLine1 || selectedStoreLocation?.preferredStoreAddress?.address1}, ${selectedStoreLocation?.preferredStoreAddress?.city}, ${selectedStoreLocation?.preferredStoreAddress?.state}`,
      };
    } else {
      payload = {
        tradeInType: 'Home',
        tradeInShippingType: data,
      };
    }
    props.cartTradeInTypeHelper(payload);
  };

  const updateStoreLocation = (store) => {
    setSelectedStoreLocation({
      preferredStoreId: store?.netaceLocationCode,
      preferredStoreAddress: store,
    });
  };

  return (
    <EditTradeInContainer data-testid='EditTradeIn'>
      {props.editTradeIn && (
        <BuyoutAmountModal showReturnChoiceScreen>
          {!props?.showReturnChoiceScreen && (
            <EditTradeInBuyoutAmountModalInner>
              <EditTradeInHeaderContainer className='u-alignMiddle'>{EditTradeInHeader}</EditTradeInHeaderContainer>

              {tradeInItems?.length > 0 ? (
                <TradeInModalBody>{EditTradeInBody}</TradeInModalBody>
              ) : (
                <div>
                  <NoTradeIn>There are no current Trade-ins for this account</NoTradeIn>
                  <TaxesFeesText>*Taxes and fees may adjust the trade in credit</TaxesFeesText>
                </div>
              )}

              <EditTradeInFooterContainer className='u-colorBackgroundSecondary'>
                {EditTradeInFooter}
              </EditTradeInFooterContainer>
            </EditTradeInBuyoutAmountModalInner>
          )}

          {showStoreLocatorModal && (
            <StoreLocatorModal
              toggleStoreLocatorModal={toggleStoreLocatorModal}
              isFromEditTradein
              cartTradeInTypeHelper={props.cartTradeInTypeHelper}
            />
          )}

          {props?.showReturnChoiceScreen && (
            <ReturnChoiceScreen
              isFromEditTradein
              hideReturnChoicePage={() => hideReturnChoicePage()}
              selectedStoreLocation={selectedStoreLocation}
              updateStoreLocation={() => updateStoreLocation()}
              returnChoiceContinueBtn={() => returnChoiceContinueBtn()}
              fromPage='EditTradeIn'
              cartTradeInTypeHelper={props.cartTradeInTypeHelper}
              isEnabledTradeReturnOptionsInContactCenterApps={props?.enableReturnOptionsInContactCenterApps}
              selectedShippingType={selectedShippingType}
              updateShippingType={() => updateShippingType()}
              device={device}
              returnChoiceHandler={() => hideReturnChoicePage()}
              multiDeviceDetails={multiDeviceDetails}
              cartDetails={cartDetails}
              isIspuItemInCart={isIspuItemInCart}
              customerType={customerType}
              preOrBackOrder={preOrBackOrder}
              setTradeInLocation={setTradeInLocation}
            />
          )}
        </BuyoutAmountModal>
      )}
    </EditTradeInContainer>
  );
}

export default EditTradeIn;

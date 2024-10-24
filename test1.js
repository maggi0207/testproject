const dummyData = [
  {
    runId: "001",
    name: "Collection A",
    startDate: "2024/10/10 08:00 AM",
    endDate: "2024/10/10 12:00 PM",
    status: "inprogress",
    matches: 120,
    mismatches: 5,
    actions: "View Details"
  },
  {
    runId: "002",
    name: "Collection B",
    startDate: "2024/10/09 09:00 AM",
    endDate: "2024/10/09 01:00 PM",
    status: "cancelled",
    matches: 85,
    mismatches: 20,
    actions: "View Details"
  },
  {
    runId: "003",
    name: "Collection C",
    startDate: "2024/10/08 10:30 AM",
    endDate: "2024/10/08 02:30 PM",
    status: "scheduled",
    matches: 150,
    mismatches: 8,
    actions: "View Details"
  }
];

// Format the dates using moment.js
dummyData.forEach(item => {
  item.startDate = moment(item.startDate).format("YYYY/MM/DD LT");
  item.endDate = moment(item.endDate).format("YYYY/MM/DD LT");
});



'?customerType=N&locationCode=0026301&salesRepId=ENC&newCustomerWithoutCredit=true&salesRepUserId=motrn1&email=ravidas@gmail.com'
 const queryParam = window.location.search;
      if (
        queryParam?.indexOf('vhi=Y') !== -1 &&
        lines?.selected < 1 &&
        lines?.assigned < 1 &&

const modifiedCartDetailsResult = {
  ...cartDetailsResult,
  data: {
    ...cartDetailsResult.data,
    cart: {
      ...cartDetailsResult.data.cart,
      cartHeader: {
        ...cartDetailsResult.data.cart.cartHeader,
        sourceSystem: undefined 
      }
    }
  }
};
 const cartDetailsResult = {

    const queryParam = window.location.search;
      if (
        queryParam?.indexOf('vhi=Y') !== -1 &&
        lines?.selected < 1 &&
        lines?.assigned < 1 &&
  data: {
    cart: {
      lineDetails: {
        lineInfo: [
          {
            lineActivityType: 'CPC',
            itemsInfo: [
              {
                cartItems: {
                  cartItem: [] 
                }
              }
            ]
          },
          {
            lineActivityType: 'FEA',
            itemsInfo: [
              {
                cartItems: {
                  cartItem: [] 
                }
              }
            ]
          }
        ]
      },
      cartHeader: {
        sourceSystem: 'SomeSource'
      }
    }
  }
};


import { useDispatch } from 'react-redux';
import { hide } from 'onevzsoemfecommon/AppLoaderActions';
import PreviewBill from 'onevzsoemfecommon/PreviewBill';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, TextLink } from '@vds/buttons';
import { Modal, ModalTitle } from '@vds/modals';
import { has } from 'lodash';
import parse from 'html-react-parser';
import { Notification } from '@vds/notifications';
import { Body, Title } from '@vds/typography';
import { useEffect, useState } from 'react';
import Emitter from 'onevzsoemfeframework/Emitter';
import { getQueryParamByName, acssMfeBasePath } from 'onevzsoemfecommon/Helpers';
import { isIpad } from 'onevzsoemfeframework/DomService';
import PropTypes from 'prop-types';
import { Accordion, AccordionDetail, AccordionHeader, AccordionItem, AccordionTitle } from '@vds/accordions';
import AgreementsAPICallHook from '../../modules/services/APIService/AgreementsAPICallHook';
import GetNextBillSummaryHook from '../../modules/services/APIService/GetNextBillSummary';
import Agreements from './Agreements';
import { affirmConstants, vvcModalConstants } from '../../appconfig';
import VerizonOrAffirmFooter from './VerizonOrAffirmFooter';
import { invokeTagging } from '../../utils/test-utils/utils';
import { scmCheckoutMfeEnabled } from '../../utils/common';

const FooterArea = styled.div`
  max-width: calc(64rem - 1.75rem);
  background-color: rgb(255, 255, 255);
  bottom: 0px;
  position: fixed;
  width: 100%;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #d8dada !important;
  justify-content: center;
  padding: 0.875rem;
`;

const FooterWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.875rem 0;
  position: relative;
  button {
    margin: 0 5px;
  }
`;

const VtTextWrapper = styled.div`
  display: flex;
  padding-right: 0.875rem 0;
  position: absolute;
  width: 44%;
  margin-right: 560px;
`;

const LinkWrapper = styled.span`
  text-align: left;
  padding-bottom: 1rem;
  margin-top: 2rem;
`;

const TextLinkWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 15px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const AffimrButton = styled(Button)`
  [class^='StyledChildWrapper-VDS'] {
    padding: 10px 35px;
    font-size: 12px;
  }
`;

const AffirmText = styled.p`
  margin-left: 1em;
  font-weight: 700;
  color: orange;
  font-size: 14px;
  font-family: BrandFontBold;
`;
const CustomHeading = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  [class^='StyledTypography-VDS'] {
    font-size: 25px;
    font-weight: 700;
    line-height: 1.5rem;
    font-family: BrandFontBold, Sans-serif !important;
  }
`;

const SubTitle = styled.div`
  margin: 30px 0;
  font-family: BrandFontBold, Sans-serif;
  font-weight: bold;
`;

const SubBody = styled.div`
  margin: 30px 0;
  font-size: 16px;
  font-family: BrandFontBold, Sans-serif;
`;

const CcdAccordianWrapper = styled.div`
  [class^='TriggerIconWrapper-VDS'] {
    margin-top: 0px;
  }
`;

const AccordionHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  align-items: center;
`;

const showDpAgreement = (lines) => {
  let hasDp = false;
  lines?.forEach((line) => {
    const deviceCartItems =
      has(line, 'itemsInfo') &&
      line?.itemsInfo?.find(
        (itemInfo) =>
          has(itemInfo, 'cartItems.cartItem') &&
          itemInfo.cartItems.cartItem.find((cartItem) => cartItem.cartItemType === 'DEVICE')
      );
    const deviceCartItem = deviceCartItems?.cartItems?.cartItem.find((cartItem) => cartItem.cartItemType === 'DEVICE');
    if (deviceCartItem?.priceType && deviceCartItem?.priceType.toLowerCase() === 'verizon_edge') {
      hasDp = true;
    }
  });
  return hasDp;
};

const isServiceOnlyOrder = (lines) => {
  const hasOtherLines =
    lines.length > 0 &&
    lines.find(
      (line) =>
        (line.lineActivityType !== 'CPC' && line.lineActivityType !== 'FEA') ||
        ((line.lineActivityType === 'FEA' || line.lineActivityType === 'CPC') &&
          has(line, 'itemsInfo[0].cartItems.cartItem') &&
          line.itemsInfo[0].cartItems.cartItem.length > 0)
    );
  return !hasOtherLines;
};

const allowOnlyNumbers = (value) => {
  const rE = /^[0-9\b]+$/;
  return value === '' || rE.test(value);
};

const Footer = ({
  handleViewTogetherClick,
  disableButton,
  spanishSelected,
  cartDetailsResult,
  customer,
  landing,
  showViewTogether,
  handleViewTogetherResumeClick,
  paperLessBilling,
  updatedEmail,
  hideOrderDetails,
  getCartDetailsDataBody,
  hideContinue,
  hideViewTogether,
  handleViewTogetherTextClick,
  setShowAffirmModal,
  continueBtnDisabled,
  setContinueBtnDisabled,
  setEmailValue,
  isAffirmLoanApproved,
  setShowAffirmAccordion,
  showAffirmModal,
  verizonVisaCardLinkSent,
  isAllSetDone,
  setCustomerMtns,
  customerMtns,
  setShowRepGuidedScreen,
  profInstallappointmentFlag,
}) => {
  const ComponentStyle = createGlobalStyle`
#CcdModal {
  [class^='Overlay-VDS'] {
    width: ${scmCheckoutMfeEnabled() ? '76.5%' : 'inherit'};
  }
  [class^='ModalDialog-VDS'] {
    max-width: 800px;
  }
  [class^='AlertWrapper-VDS'] {
    border-radius: 0;
  }
}

#Verizonvisacard {
  [class^='ModalDialog-VDS'] {
      max-width: 100%;
      padding: 48px 100px;

  }
  [class^='StyledHeader-VDS'] {
    margin: 20px 0;
  }
`;

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementData, setAgreementData] = useState({
    type: '',
    title: '',
    body: '',
    isFirstPdf: false,
  });
  const [previousEmail, setPreviousEmail] = useState('');
  const [isDisclosureAgreementSent, setIsDisclosureAgreementSent] = useState(false);
  const [showVccModal, setShowVccModal] = useState(false);
  const [isAffirmFinance, setIsAffirmFinance] = useState(false);
  const [affirmFinanceChecked, setAffirmFinanceChecked] = useState(false);
  const [verizonVisaChecked, setVerizonVisaChecked] = useState(false);
  const [showPreviewBil, setShowPreviewBill] = useState(false);
  const [isAllSetDoneFlow, setIsAllSetDoneFlow] = useState(false);
  const [CPCorFEAonlyOrder, setCPCorFEAonlyOrder] = useState(false);
  const ccdForServiceChange = JSON.parse(sessionStorage.getItem('assistedFlags'))?.ccdForServiceChange === 'TRUE';

  let navigate = '';
  function useNavigateMFE() {
    navigate = useNavigate();
  }
  try {
    useNavigateMFE();
  } catch (e) {
    /* istanbul ignore next */
    console.log('');
  }

  const {
    getOrderWrite,
    getOrderWriteResult,
    getRetrieveInstallmentAgreement,
    getRetrieveInstallmentAgreementResult,
    retrieveAEMInfoManagerDataRequest,
    retrieveAEMInfoManagerDataResponse,
    getCustomerByMtns,
    getCustomerByMtnsResult,
  } = AgreementsAPICallHook();
  const { getNextBillSummaryReq, getNextBillSummaryRes } = GetNextBillSummaryHook();

  useEffect(() => {
    if (cartDetailsResult?.data?.cart?.orderDetails?.accessoryFinancingOfferInfo) {
      setIsDisclosureAgreementSent(
        cartDetailsResult?.data?.cart?.orderDetails?.accessoryFinancingOfferInfo?.disclosureAgreementSent
      );
      setVerizonVisaChecked(cartDetailsResult?.data?.cart?.orderDetails?.accessoryFinancingOfferInfo?.offerAccepted);
      if (
        cartDetailsResult?.data?.cart?.orderDetails?.accessoryFinancingOfferInfo?.offerAccepted &&
        !cartDetailsResult?.data?.cart?.orderDetails?.accessoryFinancingOfferInfo?.disclosureAgreementSent &&
        customerMtns?.length === 0
      ) {
        getCustomerByMtns({ body: { mtn: '', customerId: '' }, spinner: true, mock: false });
      }
    }
    if (cartDetailsResult?.data?.cart?.orderDetails?.affirmFinancingOfferInfo) {
      setIsAffirmFinance(cartDetailsResult?.data?.cart?.orderDetails?.affirmFinancingOfferInfo?.offerAvailable);
    }
  }, [cartDetailsResult?.data?.cart]);

  useEffect(() => {
    if (getCustomerByMtnsResult?.data) {
      const mtnList = getCustomerByMtnsResult?.data?.customerInfo?.billDetailsList?.[0]?.mtns;
      const email = getCustomerByMtnsResult?.data?.customerInfo?.email;
      const mtns = mtnList?.map((item) => item.mtn) || [];
      setCustomerMtns(mtns);
      setEmailValue(email);
    }
  }, [getCustomerByMtnsResult]);

  useEffect(() => {
    if (getNextBillSummaryRes?.data?.nbsVo) {
      const details = {
        PAGE_LOADED: 'true',
        CUSTOM_EVENT: 'Pageview',
      };
      Emitter.emit('PAGE_LOADED', details);
    }
  }, [getNextBillSummaryRes?.data?.nbsVo]);

  const showAccessoryVvcModal = () => {
    setShowVccModal(true);
  };

  useEffect(() => {
    if (getOrderWriteResult?.data) {
      if (isAllSetDoneFlow && !scmCheckoutMfeEnabled()) return;
      const { data } = getOrderWriteResult;
      const currentEmail = cartDetailsResult?.data?.cart?.orderDetails?.spocs?.notificationOptions?.primaryEmailId;
      setPreviousEmail(currentEmail);
      let inventoryError = false;
      if (data?.errors && data?.errorMessage && data?.errors?.length) {
        inventoryError = data.errors.some((err) => err.id === '3251');
      }
      if (!inventoryError) {
        const channel = cartDetailsResult?.data?.cart?.orderDetails?.orderChannelId ?? '';
        const showAgreement =
          showDpAgreement(cartDetailsResult?.data?.cart?.lineDetails?.lineInfo) &&
          (channel.indexOf('OMNI-RETAIL') > -1 ||
            channel.indexOf('OMNI-D2D') > -1 ||
            channel.indexOf('OMNI-INDIRECT') > -1);
        const availablePaths =
          channel !== 'OMNI-TELESALES' && has(data, 'availablePaths')
            ? data?.availablePaths?.filter(
                (agreement) =>
                  agreement.path === 'CustomerAgreement' ||
                  agreement.path === 'DevicePaymentAgreement' ||
                  agreement.path === 'NBS'
              )
            : [];
        const hasDpAgreement =
          availablePaths?.find((agreement) => agreement.path === 'DevicePaymentAgreement') || showAgreement;

        if (hasDpAgreement) 
        {
          const request = {
            header: {},
            cartId: cartDetailsResult?.data?.cart?.cartHeader?.cartId ?? '',
          };
          getRetrieveInstallmentAgreement({ body: request, spinner: true, mock: false });
        } else if (!scmCheckoutMfeEnabled()) {
          navigate(`/sales/assisted/new/payment-agreement.html`);
        } else if (scmCheckoutMfeEnabled() && CPCorFEAonlyOrder) {
          window?.mfe?.historyRef.push(`${acssMfeBasePath}/care-order-confirmation.html`);
        } else if (scmCheckoutMfeEnabled() && !CPCorFEAonlyOrder) {
          window?.mfe?.historyRef.push(`payment-agreement.html`);
        }
      } else if (!scmCheckoutMfeEnabled()) {
        navigate(`/sales/assisted/new/payment-agreement.html`);
      } else if (scmCheckoutMfeEnabled()) {
        window?.mfe?.historyRef.push(`payment-agreement.html`);
      }
    }
  }, [getOrderWriteResult]);

  useEffect(() => {
    if (getRetrieveInstallmentAgreementResult?.data) {
      const { type, response } = getRetrieveInstallmentAgreementResult.data;
      setShowAgreementModal(true);
      setAgreementData({
        type,
        body: response?.[0]?.installmentContractData ?? '',
        isFirstPdf: true,
      });
    }
  }, [getRetrieveInstallmentAgreementResult]);

  useEffect(() => {
    if (retrieveAEMInfoManagerDataResponse?.data) {
      setShowModal(true);
      invokeTagging('openView', 'CCD');
      setTimeout(() => {
        dispatch(hide({ active: false }));
      }, 2000);
    }
  }, [retrieveAEMInfoManagerDataResponse]);

  const handleConfirm = () => {
    if (scmCheckoutMfeEnabled()) {
      setShowModal(false);
      OrderWriteCall();
      // window?.mfe?.historyRef.push('payment-agreement.html');
      return;
    }
    if (profInstallappointmentFlag) {
      setShowModal(false);
      return;
    }
    if (isAllSetDoneFlow) {
      setShowModal(false);
      OrderWriteCall();
      getNextBillSummaryReq({ body: { nseFlow: true, unifiedNbsFlag: false, enableVzdlFlow: true }, spinner: false });
      setShowPreviewBill(true);
      return;
    }
    if (!isDisclosureAgreementSent && verizonVisaChecked && !isAffirmLoanApproved && !verizonVisaCardLinkSent) {
      setShowRepGuidedScreen(true);
    } else {
      OrderWriteCall();
    }
  };

  const OrderWriteCall = () => {
    const activeMtn = cartDetailsResult?.data?.cart?.cartHeader?.cartCreator ?? '';

    const currentEmail = cartDetailsResult?.data?.cart?.orderDetails?.spocs?.notificationOptions?.primaryEmailId;
    let isServiceWriteRequired = false;
    if (currentEmail !== previousEmail) {
      isServiceWriteRequired = true;
    }

    let emailId = cartDetailsResult?.data?.cart?.orderDetails?.spocs?.notificationOptions?.primaryEmailId ?? '';

    const customerType =
      cartDetailsResult?.data?.cart?.orderDetails?.customerType || sessionStorage.getItem('customerType');
    if (customerType === 'N' && updatedEmail !== null) {
      emailId = updatedEmail;
    } else if (customerType === 'N') {
      emailId = cartDetailsResult?.data?.cart?.lineDetails?.lineInfo?.[0]?.primaryUserInfo?.emailId ?? emailId;
    }

    const response = sessionStorage.getItem('responseList');
    const responseList = JSON.parse(response);
    const responses = responseList?.filter((res) => res.dispositionOptionId === '18');
    const resList = responses?.map((res) => ({
      rank: res?.rank ? res.rank : '',
      propositionId: res?.propositionId ? res.propositionId : '',
      soiEngagementId: res?.soiEngagementId ? res.soiEngagementId : '',
      offerContainerId: res?.offerContainerId ? res.offerContainerId : '',
    }));

    const quoteId = cartDetailsResult?.data?.cart?.quote?.quoteId ?? '';
    const billingSystem = cartDetailsResult?.data?.cart?.orderDetails?.billingSystem || '';

    const currentQuoteId = () => {
      const activeCartId = customer?.cartId ?? '';
      const isQuoteDetailsAvailable = landing?.quoteDetails ?? [];
      if (isQuoteDetailsAvailable.length > 0) {
        const currentQuote = isQuoteDetailsAvailable.filter((item) => item.cartId === activeCartId);
        return currentQuote.length > 0 ? currentQuote[0].quoteId : '';
      }
      return '';
    };

    const creditAppNum = getQueryParamByName('creditAppNum') || sessionStorage.getItem('creditAppNum');

    const lines =
      has(cartDetailsResult?.data?.cart, 'lineDetails.lineInfo') &&
      cartDetailsResult?.data?.cart?.lineDetails?.lineInfo;

    const channel = has(cartDetailsResult?.data?.cart, 'cartHeader.sourceSystem')
      ? cartDetailsResult?.data?.cart?.cartHeader?.sourceSystem
      : sessionStorage.getItem('channelId');

    const hasEupByodWithSimCpe =
      lines.length > 0 &&
      lines.every((line) =>
        line.lineActivityType !== ' ' && line.lineActivityType === 'EUPBYOD' && !channel?.includes('OMNI-INDIRECT')
          ? line?.itemsInfo?.[0]?.cartItems?.cartItem?.some(
              (item) => item.cartItemType === 'SIM' && item.isCustomerProvidedSIM === true
            )
          : line.lineActivityType === 'EUPBYOD'
      );

    const isCPCorFEAonlyOrder = lines.length > 0 ? isServiceOnlyOrder(lines) : false;
    setCPCorFEAonlyOrder(isCPCorFEAonlyOrder);

    const lineInfoLength = !!(
      has(cartDetailsResult?.data?.cart, 'lineDetails.lineInfo') &&
      cartDetailsResult?.data?.cart?.lineDetails?.lineInfo?.length
    );

    const tradeinItemsLength = !!(
      has(cartDetailsResult?.data?.cart, 'lineDetails.tradeInDetail.tradeInItems') &&
      cartDetailsResult?.data?.cart?.lineDetails?.tradeInDetail?.tradeInItems.length
    );

    let noOfTradeItems = 0;
    if (tradeinItemsLength) {
      noOfTradeItems = cartDetailsResult?.data?.cart?.lineDetails?.tradeInDetail?.tradeInItems.length;
    }

    const tradeInShippingType =
      tradeinItemsLength && cartDetailsResult?.data?.cart?.lineDetails?.tradeInDetail?.tradeInShippingType;

    const standAloneTradeIn = !!(!lineInfoLength && tradeinItemsLength);

    const isAccLevelSubItemPresent = () => {
      const accSubInCart = cartDetailsResult?.data?.cart?.lineDetails?.acctMcsSubscription ?? [];
      let isAccSubInCart = false;
      if (accSubInCart?.[0]) {
        isAccSubInCart = true;
      }
      return isAccSubInCart;
    };

    const isAccLevelSubItemPresentValue = isAccLevelSubItemPresent();

    let intentType;
    if (standAloneTradeIn) {
      intentType = 'StandAloneTradeIn';
    } else if (hasEupByodWithSimCpe) {
      intentType = 'EUPBYOD';
    } else if (isCPCorFEAonlyOrder || isAccLevelSubItemPresentValue) {
      intentType = 'Inline-CPC';
    } else {
      intentType = '';
    }

    const params = {
      mtn: activeMtn && allowOnlyNumbers(activeMtn) ? activeMtn : '',
      locationCode: cartDetailsResult?.data?.cart?.orderDetails?.locationCode ?? '',
      accountNumber: customer?.accountNo,
      cartId: cartDetailsResult?.data?.cart?.cartHeader?.cartId ?? '',
      cartCreator:
        customerType && customerType === 'N'
          ? creditAppNum
          : cartDetailsResult?.data?.cart?.cartHeader?.cartCreator ?? '',
      caseId: cartDetailsResult?.data?.cart?.cartHeader?.caseId ?? '',
      creditAppNum: customerType === 'N' ? creditAppNum : '',
      serviceWriteRequired: isServiceWriteRequired,
      smsDestination: '',
      email: emailId ?? '',
      intent: customerType && customerType === 'N' ? 'NSE' : intentType,
      paperlessIndicator: customerType && customerType === 'N' ? paperLessBilling : null,
      paperLessEmail: customerType && customerType === 'N' && paperLessBilling ? emailId : null,
      header: {
        cartId: cartDetailsResult?.data?.cart?.cartHeader?.cartId ?? '',
      },
      responseList: resList,
      regNo: customer?.regNo ?? isIpad() ? '51' : '10',
      quoteId: quoteId !== '' && quoteId !== '0000' ? quoteId : currentQuoteId(),
      purchaseOrderNumber: '',
      billingSystem,
    };

    if (
      params.email === '' ||
      params.email === cartDetailsResult?.data?.cart?.orderDetails?.spocs?.notificationOptions?.primaryEmailId
    ) {
      params.serviceWriteRequired = false;
    }

    if (tradeinItemsLength) {
      params.tradeinCount = noOfTradeItems;
      params.tradeinShippingTypeForAssistedFlows = tradeInShippingType ?? '';
    }

    const appProperties = JSON.parse(sessionStorage.getItem('APP_PROPERTIES')) || {};
    const isMitekSimSwapEnabled = appProperties?.isMitekSimSwapEnabled === 'TRUE';
    const locationData = JSON.parse(sessionStorage.getItem('locationData'));

    if (isMitekSimSwapEnabled) {
      params.storeCity = locationData?.city ?? '';
      params.storeState = locationData?.state ?? '';
    }

    getOrderWrite({
      body: params,
      spinner: true,
      mock: false,
    });
  };

  const prepareCcdApiPayload = (lineDetails, languageSpanish) => {
    const planIds = [];
    lineDetails?.lineInfo.forEach((line) => {
      if (line?.serviceInfo?.newPricePlanId) {
        planIds.push({ id: line?.serviceInfo?.newPricePlanId, status: 'add' });

        if (line?.serviceInfo?.oldPricePlanId) {
          planIds.push({ id: line?.serviceInfo?.oldPricePlanId, status: 'remove' });
        }
      } else if (line?.serviceInfo?.pricePlanInfo?.pricePlanCode) {
        planIds.push({ id: line?.serviceInfo?.pricePlanInfo?.pricePlanCode, status: 'keep' });
      } else if (line?.serviceInfo?.oldPricePlanId) {
        planIds.push({ id: line?.serviceInfo?.oldPricePlanId, status: 'keep' });
      }
    });

    const sbdOffers =
      lineDetails?.lineInfo
        ?.flatMap((e) => e?.serviceInfo?.sbdOffer)
        ?.map((e) => e?.offerId)
        ?.filter((e) => e !== undefined) || [];
    const tradeInOffers =
      lineDetails?.tradeInDetail?.tradeInItems
        ?.flatMap((e) => e?.recycleDeviceOffer)
        ?.map((e) => e?.offerId)
        ?.filter((e) => e !== undefined) || [];
    const promoOfferIds = [...new Set([...sbdOffers, ...tradeInOffers])].map((id) => ({ id, status: 'A' })) || [];
    const setFeatureIdStatus = (addDeleteInd) => {
      let idStatus = 'remove';
      if (addDeleteInd === 'A') {
        idStatus = 'add';
      } else if (addDeleteInd === 'Z') {
        idStatus = 'keep';
      }
      return idStatus;
    };
    const featureIds = [
      ...new Set(
        lineDetails?.lineInfo
          ?.flatMap((x) => x?.serviceInfo?.selectedFeaturesList?.visFeature)
          ?.map((x) => ({ id: x?.visFeatureCode, status: setFeatureIdStatus(x?.addDeleteInd) })) || []
      ),
    ];

    const channelFlow = () => {
      let channelType = 'direct_';
      let orderType = 'service_change_flow';

      if (sessionStorage.getItem('channel') === 'OMNI-INDIRECT') {
        channelType = 'indirect_';
      }

      lineDetails?.lineInfo?.map((item) => {
        if (
          item.lineActivityType &&
          (item.lineActivityType.includes('AAL') ||
            item.lineActivityType.includes('NSE') ||
            item.lineActivityType.includes('EUP') ||
            item.lineActivityType.includes('BYOD'))
        ) {
          orderType = 'purchase_flow';
        }
        return `${channelType + orderType}`;
      });

      return `${channelType + orderType}`;
    };

    const requestPayload = {
      content: {
        planIds: {
          idlist: planIds,
          category: 'plan',
        },
        featureIds: {
          idlist: featureIds,
          category: 'feature',
        },
        promoIds: {
          idlist: promoOfferIds,
          category: 'promo',
        },
      },
      channel: channelFlow(),
      contenttype: 'html',
      langInd: !languageSpanish ? 'EN' : 'ES',
    };
    return requestPayload;
  };

  const CcdAemInfoApi = () => {
    window.sessionStorage.setItem('isViewTogether', false);
    const lineDetails = cartDetailsResult?.data?.cart?.lineDetails;
    const languageSpanish = spanishSelected;
    const requestPayload = prepareCcdApiPayload(lineDetails, languageSpanish);
    retrieveAEMInfoManagerDataRequest({
      body: requestPayload,
      mock: false,
    });
  };

  const isAffirmEligibilty = () => {
    const channel = sessionStorage.getItem('channel');
    const orderType = cartDetailsResult?.data?.cart?.orderDetails?.orderType;
    return (
      ((isAffirmFinance && orderType === 'IS') || !isAffirmLoanApproved) &&
      channel &&
      channel.indexOf('OMNI-RETAIL') > -1
    );
  };

  const handleAffirmEligibilityCheck = () => {
    if (isAffirmEligibilty() && !showAffirmModal) {
      setShowAffirmModal(true);
      setContinueBtnDisabled(true);
      setShowAffirmAccordion(true);
    }
  };
  const onAllSetDoneClick = () => {
    if (scmCheckoutMfeEnabled()) {
      setIsAllSetDoneFlow(true);
      const lineDetails = cartDetailsResult?.data?.cart?.lineDetails;
      const languageSpanish = spanishSelected;
      const requestPayload = prepareCcdApiPayload(lineDetails, languageSpanish);
      retrieveAEMInfoManagerDataRequest({
        body: requestPayload,
        spinner: true,
        mock: false,
      });
    } else {
      setIsAllSetDoneFlow(true);
      setShowModal(true);
      if (ccdForServiceChange) CcdAemInfoApi();
    }
  };

  return (
    <div>
      {showModal && (
        <div data-testid='CcdModal' id='CcdModal'>
          <div>
            <ComponentStyle />
            <Modal
              id='CcdModal'
              surface='light'
              width='800px'
              fullScreenDialog={false}
              disableAnimation={false}
              disableOutsideClick={false}
              hideCloseButton={false}
              ariaLabel='Testing Modal'
              opened={showModal}
              onOpenedChange={(opened) => {
                if (!opened) {
                  invokeTagging('closeView', '');
                  setShowModal(false);
                }
              }}
            >
              <div>
                <Notification
                  type='error'
                  id='ccdAlert'
                  layout='vertical'
                  title='CCDs must be read to the customer when View Together is not used.'
                  hideCloseButton={false}
                />
                <CustomHeading>
                  <Title bold size='large'>
                    {spanishSelected ? 'Aquí está lo que necesitas saber.' : 'Here is what you need to know.'}
                  </Title>
                </CustomHeading>
                <Body bold size='small'>
                  {spanishSelected
                    ? 'Ya casi terminas. Un resumen actualizado de tu servicio estará disponible en Mi Verizon.'
                    : "You're almost done. An updated summary of your service will be available in My Verizon."}
                </Body>
              </div>
              {retrieveAEMInfoManagerDataResponse?.data?.content?.length > 0 &&
                retrieveAEMInfoManagerDataResponse?.data?.content?.map((value) =>
                  value.display === 'summary' ? (
                    <div key={value.display}>
                      <div dangerouslySetInnerHTML={{ __html: value.content }} />
                    </div>
                  ) : (
                    <CcdAccordianWrapper>
                      <Accordion key={value.title} topLine bottomLine>
                        <AccordionItem>
                          <AccordionHeader>
                            <AccordionHeaderWrapper>
                              <AccordionTitle>{value.title}</AccordionTitle>
                            </AccordionHeaderWrapper>
                          </AccordionHeader>
                          <AccordionDetail>
                            <div dangerouslySetInnerHTML={{ __html: value.content }} />
                          </AccordionDetail>
                        </AccordionItem>
                      </Accordion>
                    </CcdAccordianWrapper>
                  )
                )}
              <div>
                <TextLinkWrapper>
                  <Button use='primary' data-track='CcdModal' data-testid='CcdModalBtn' onClick={handleConfirm}>
                    I confirm I have read the CCDs to the customer
                  </Button>
                </TextLinkWrapper>
              </div>
            </Modal>
          </div>
        </div>
      )}
      {showVccModal && (
        <div data-testid='Verizonvisacard' id='Verizonvisacard'>
          <div>
            <ComponentStyle />
            <Modal
              id='Verizonvisacard'
              surface='light'
              width='1200px'
              fullScreenDialog
              ariaLabel='Testing Modal'
              opened={showVccModal}
              onOpenedChange={(opened) => {
                if (!opened) setShowVccModal(false);
              }}
            >
              <div>
                <ModalTitle>{vvcModalConstants.headerLabel}</ModalTitle>
                <CustomHeading>
                  <Title bold size='large'>
                    {parse(vvcModalConstants.bodyHeaderContent)}
                  </Title>
                  <SubTitle>{vvcModalConstants.conditionsContent}</SubTitle>
                </CustomHeading>
                <Body size='small'>
                  <SubBody>{parse(vvcModalConstants.descriptionContent)}</SubBody>
                  <SubBody>{vvcModalConstants.licenseContent}</SubBody>
                </Body>
              </div>
              <div>
                <ButtonWrapper>
                  <Button
                    use='primary'
                    data-track='Verizonvisacard'
                    data-testid='VerizonvisacardBtn'
                    onClick={() => setShowVccModal(false)}
                  >
                    {vvcModalConstants.closeLabel}
                  </Button>
                </ButtonWrapper>
              </div>
            </Modal>
          </div>
        </div>
      )}
      {!showModal && !hideOrderDetails && (
        <FooterArea>
          <VerizonOrAffirmFooter
            getCustomerByMtns={getCustomerByMtns}
            isAffirmLoanApproved={isAffirmLoanApproved}
            verizonVisaChecked={verizonVisaChecked}
            isAffirmFinance={isAffirmFinance}
            affirmFinanceChecked={affirmFinanceChecked}
            showAccessoryVvcModal={showAccessoryVvcModal}
            setAffirmFinanceChecked={setAffirmFinanceChecked}
            setVerizonVisaChecked={setVerizonVisaChecked}
            customerMtns={customerMtns}
            cartDetailsResult={cartDetailsResult}
            getCartDetailsDataBody={getCartDetailsDataBody}
          />
          <FooterWrapper affirmFinanceChecked={affirmFinanceChecked && !isAffirmLoanApproved}>
            {affirmFinanceChecked && !isAffirmLoanApproved ? (
              <>
                <AffimrButton
                  size='small'
                  data-testid='ContinueBtn'
                  inverted
                  secondary
                  onClick={handleAffirmEligibilityCheck}
                >
                  {affirmConstants.affirmButton}
                </AffimrButton>
                {cartDetailsResult?.data?.cart?.lineDetails.lineInfo[0].itemsInfo[0].depletionType === 'L' ? (
                  ''
                ) : (
                  <AffirmText>{affirmConstants.affinrShiipinglabel}</AffirmText>
                )}
              </>
            ) : (
              <>
                <VtTextWrapper>
                  {disableButton && showViewTogether && (
                    <Body bold size='small'>
                      Please{' '}
                      <LinkWrapper>
                        <TextLink
                          type='standAlone'
                          data-testId='view-togther-click'
                          surface='light'
                          disabled={false}
                          size='small'
                          onClick={() => {
                            handleViewTogetherTextClick();
                          }}
                        >
                          {' '}
                          click here
                        </TextLink>
                      </LinkWrapper>{' '}
                      to see View Together options ( Updates made on the rep side will automatically reflect on the
                      customer side without sending another link or generating a new QR code)
                    </Body>
                  )}
                </VtTextWrapper>
                {!hideContinue && (
                  <Button
                    size='small'
                    data-testid='ContinueBtn'
                    disabled={continueBtnDisabled}
                    inverted
                    secondary
                    onClick={CcdAemInfoApi}
                  >
                    Continue
                  </Button>
                )}
                {isAllSetDone && (
                  <Button size='small' data-testid='AllSetDoneBtn' inverted secondary onClick={onAllSetDoneClick}>
                    All Set & Done
                  </Button>
                )}
                {!hideViewTogether && (
                  <Button
                    data-testid='view-together-footer'
                    size='small'
                    width='150px'
                    inverted
                    secondary
                    onClick={showViewTogether ? handleViewTogetherClick : handleViewTogetherResumeClick}
                    disabled={disableButton && showViewTogether}
                  >
                    {showViewTogether ? 'View Together' : 'Resume - View Together'}
                  </Button>
                )}
              </>
            )}
          </FooterWrapper>
        </FooterArea>
      )}
      {showAgreementModal && (
        <Agreements
          showAgreementModal={showAgreementModal}
          setShowAgreementModal={(bool) => {
            setShowAgreementModal(bool);
            setShowModal(false);
          }}
          handleAgreementData={(data) => {
            setAgreementData(data);
            setShowAgreementModal(true);
          }}
          installmentAgreementResult={getRetrieveInstallmentAgreementResult?.data}
          agreementModalData={agreementData}
          channel={cartDetailsResult?.data?.cart?.orderDetails?.orderChannelId ?? ''}
        />
      )}

      {showPreviewBil && (
        <PreviewBill
          navigateTo='/sales/assisted/new/order-confirmation.html'
          billData={getNextBillSummaryRes?.data?.nbsVo}
          opened={showPreviewBil}
          closeModal={() => {
            setShowPreviewBill(false);
            navigate('/sales/assisted/new/order-confirmation.html');
          }}
        />
      )}
    </div>
  );
};

Footer.propTypes = {
  handleViewTogetherClick: PropTypes.func,
  disableButton: PropTypes.bool,
  spanishSelected: PropTypes.bool,
  cartDetailsResult: PropTypes.object,
  customer: PropTypes.object,
  landing: PropTypes.object,
  showViewTogether: PropTypes.bool,
  handleViewTogetherResumeClick: PropTypes.func,
  paperLessBilling: PropTypes.string,
  updatedEmail: PropTypes.string,
  hideOrderDetails: PropTypes.bool,
  getCartDetailsDataBody: PropTypes.func,
  hideContinue: PropTypes.bool,
  hideViewTogether: PropTypes.bool,
  handleViewTogetherTextClick: PropTypes.func,
  setShowAffirmModal: PropTypes.func,
  continueBtnDisabled: PropTypes.bool,
  setContinueBtnDisabled: PropTypes.func,
  setEmailValue: PropTypes.func,
  isAffirmLoanApproved: PropTypes.bool,
  setShowAffirmAccordion: PropTypes.func,
  showAffirmModal: PropTypes.bool,
  verizonVisaCardLinkSent: PropTypes.bool,
  isAllSetDone: PropTypes.bool,
  setCustomerMtns: PropTypes.func,
  setShowRepGuidedScreen: PropTypes.func,
  customerMtns: PropTypes.array,
  profInstallappointmentFlag: PropTypes.bool,
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import styled from 'styled-components';
import Emitter from 'onevzsoemfeframework/Emitter';
import { Input } from '@vds/inputs';
import { Line } from '@vds/lines';
import { Checkbox } from '@vds/checkboxes';
import { getQueryParamByName, isIpad, isRetail, isTelesales } from 'onevzsoemfeframework/DomService';
import { sendCustomEvent } from 'onevzsoemfeframework/Tagging';
import { getAssistedCradleProperty } from 'onevzsoemfeframework/AssistedCradleService';
import { getUIContextPath, getUIContextPathBAU } from 'onevzsoemfecommon/Helpers';
import * as appMessageActions from 'onevzsoemfecommon/AppMessageActions';
import { ConfirmationDialogBox } from 'onevzsoemfecommon/ConfirmationDialogBox';
import * as DOMPurify from 'dompurify';
import { useLazyESimDetailsQuery } from '../../../modules/services/APIService/APIServiceHooks';
import DeviceScan from '../../CombinedGridwall/DeviceScan';
import ESim from '../../CombinedGridwall/ESim/ESim';
import SimScan from './SimScan';
import PDPApiCallHook from '../../../pages/PDP/PDPApiCallHook';
import IDScanModal from '../IDScanSecurity/IDScanModal';
import SecondLineDeviceId from '../SecondLineDeviceId';
import {
  MTN_TYPE_PRE_TO_POST,
  MTN_TYPE_YAHOO,
  MTN_TYPE_VISIBLE,
  MTN_TYPE_HARMONY,
} from '../../constants/DeviceConstants';
import getIspuSimEnable from '../../../modules/utils/getIspuSimEnable';

const DivWrapper = styled.div`
  display: block;
  width: ${window?.mfe?.scmDeviceMfeEnable && '16rem'};
  overflow-wrap: ${window?.mfe?.scmDeviceMfeEnable && 'break-word'};
`;
const DeviceWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  justify-content: space-between;
`;
const IpadSimContent = styled.div`
  width: max-content;
`;
const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
`;
const SIMIDWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 21rem;
`;
const CheckboxWrapper = styled.div`
  margin-top: 10px;
`;
const HorizontalLineWrapper = styled.div`
  padding: 1rem 0 1rem 0;
`;

const DisplayWrapper = styled.div`
  padding: 1rem 0 1rem 0;
`;

let navigate = '';

function useNavigateMFE() {
  navigate = useNavigate();
}

function HorizontalLine() {
  return (
    <HorizontalLineWrapper>
      <Line type='secondary' surface='light' />
    </HorizontalLineWrapper>
  );
}

const DeviceSimID = (props) => {
  const { deviceFromFilteredCartLine, simFromFilteredCartLine, setIsSecNumValidation } = props;
  const CustomerData = props.customerProfileDetails?.customer;
  const commonInfo = props.customerProfileDetails?.commonInfo;
  const channel = CustomerData?.channel || sessionStorage.getItem('channel');
  const deviceFromCart = /true/i.test(getQueryParamByName('deviceFromCart'));
  const localScan = /true/i.test(getQueryParamByName('isLocal'));

  const [validatedDeviceId, setValidatedDeviceId] = useState(
    props.isByodUpdate || props.isFromCPE || props.isLocal ? getQueryParamByName('deviceId') : props.defaultDeviceId,
  );
  // as per BAU for local scan no need to show previous sim id
  const [validatedSimId, setValidatedSimId] = useState(props.isByodUpdate || props.isFromCPE ? props.defaultSimId : '');
  const isEditAndView = /true/i.test(getQueryParamByName('isEditAndView'));
  const [cpeCheckbox, setCpeCheckbox] = useState(true);
  const [simSkuEntered, setSimSkuEntered] = useState('');
  const [simSkuOverride, setSimSkuOverride] = useState(false);
  const [simSkuOnFocus, setSimSkuOnFocus] = useState('');
  const isOmniCare = props.customerProfileDetails?.customer?.channel === 'OMNI-CARE';
  const [deviceIdChanged, setDeviceIdChanged] = useState(false);
  const [updatedDeviceId, setUpdatedDeviceId] = useState(false);
  const [simDisabled, setSimDisabled] = useState(false);
  const [isSingleSimEntiLookupModalVisibleByod, setIsSingleSimEntiLookupModalVisibleByod] = useState(false);
  const [isDualSimEntiLookupModalVisible, setIsDualSimEntiLookupModalVisible] = useState(false);
  const [devicedata, setdevicedata] = useState({});
  const [devicePayload, setDevicePayload] = useState({});
  const [popUp, setPopUp] = useState(false);
  const [isIdScanModalOpen, setIdScanModalOpen] = useState(false);
  const [eSimData, eSimDataResults] = useLazyESimDetailsQuery();
  const [validateDeviceSimRequest, setValidateDeviceSimRequest] = useState({});
  const [secondLine, setSecondLine] = useState(false);
  const [repSelectedSimType, setRepSelectedSimType] = useState('');
  const { validateDeviceSimIdRequestBody, ValidateDeviceSimIdResult } = PDPApiCallHook();
  const ValidateDeviceSimIdResultStatus = ValidateDeviceSimIdResult?.status;

  const { isVideoAssistFlow = false, isIndirect, isBYODUpdateAALRetail, byodDevice, scanCheck, setSimIdResult } = props;
  const [isMitekSimSwapEnabled] = getAssistedCradleProperty(['isMitekSimSwapEnabled']);
  let [skipIccidCall] = getAssistedCradleProperty(['skipIccidCall']);
  skipIccidCall = /true/i.test(skipIccidCall); // converting String (TRUE/FALSE) to boolean (true/false)
  const appPropertiesFromSessionStorage = DOMPurify.sanitize(sessionStorage.getItem('APP_PROPERTIES'));
  const pearlBYODFlow = appPropertiesFromSessionStorage
    ? JSON.parse(appPropertiesFromSessionStorage)?.pearlBYODFlow === 'TRUE'
    : false;
  const isPearl = DOMPurify.sanitize(sessionStorage.getItem('isPearl')) === 'true' && pearlBYODFlow;

  const dispatch = useDispatch();
  const scmDeviceEnable = window?.mfe?.scmDeviceMfeEnable;
  // const navigate = scmDeviceEnable ? "" :useNavigate();

  try {
    useNavigateMFE();
  } catch (e) {
    /* istanbul ignore next */
    console.log(`UseNavigate Exception ${e}`);
  }

  function assignNumberRedirect() {
    if (scmDeviceEnable) window?.mfe?.historyRef?.push('/content/vcg/assisted/numberselection.html');
    else navigate(`${getUIContextPathBAU()}/numberselection.html`);
  }

  const disableDeviceDetailsForAsurion = false;
  const showScanner = commonInfo?.showScanner;
  const isCustomerProvidedEquipment = !!(props.isByodUpdate || props.isFromCPE);
  const isEsimOnlyDevice = !isEmpty(devicedata)
    ? devicedata?.eSimOnlyDevice
    : getQueryParamByName('eSimOnlyDevice') === 'true' || getQueryParamByName('eSim') === 'true';
  const simProcessOnlyIpad = !!(
    !isIpad() &&
    !scmDeviceEnable &&
    !props.isNewLine &&
    channel &&
    (channel?.indexOf('OMNI-RETAIL') > -1 ||
      channel?.indexOf('OMNI-D2D') > -1 ||
      channel === 'OMNI-TELESALES' ||
      channel === 'OMNI-CARE' ||
      (channel?.includes('OMNI-INDIRECT') && !deviceIdChanged))
  );
  let isByodUpdateOnDekstop = !!(props.isByodUpdate && !isIpad());
  const customerType = sessionStorage.getItem('customerType');
  const deviceInfo = ValidateDeviceSimIdResult?.data?.serviceBody?.serviceResponse?.context?.deviceInfo;
  const correlationId = ValidateDeviceSimIdResult?.data?.serviceHeader?.correlationId;
  const [deviceIdEsimCheck, setDeviceIdEsimCheck] = useState(
    skipIccidCall && devicedata?.eid !== '' ? devicedata?.deviceId : '',
  );
  useEffect(() => {
    const deviceIdVal = getQueryParamByName('deviceId');
    let simIdVal = getQueryParamByName('simId');
    if (!isEmpty(byodDevice)) {
      const deviceIdValue = byodDevice.deviceId ? byodDevice.deviceId : deviceIdVal || '';
      const simIdValue = byodDevice.simInfo ? byodDevice.simInfo.preferredSoftSim : simIdVal || '';
      if (!secondLine) {
        setValidatedDeviceId(deviceIdValue);
      }
      setValidatedSimId(simIdValue);
    } else {
      if (deviceIdVal) {
        if (!secondLine) {
          setValidatedDeviceId(deviceIdVal);
        }
      }
      if (simIdVal) {
        if (
          channel?.indexOf('OMNI-RETAIL') > -1 &&
          !props.isByodUpdate &&
          getQueryParamByName('scanFromLanding') !== 'true' &&
          getQueryParamByName('prospectByodFlow') !== 'true'
        ) {
          simIdVal = '';
        }
        setValidatedSimId(simIdVal);
      }
    }
    if (deviceFromCart) setDeviceAndSimIdHandler();
    updateCareDataOnMountAndUpdate(true);
    Emitter.on('CONT_SIM_SKU_VALIDATION', (value) => {
      setSimSkuEntered(value);
      callValidateDeviceSku();
    });
    return () => {
      Emitter.off('CONT_SIM_SKU_VALIDATION');
    };
  }, []);

  useEffect(() => {
    updateCareDataOnMountAndUpdate();
  }, [props?.deviceIdSelected]);

  useEffect(() => {
    props.updateDeviceData(devicedata);
    if (devicedata?.deviceId) setUpdatedDeviceId(true);
  }, [devicedata]);

  useEffect(() => {
    props.updateDeviceId(validatedDeviceId);
  }, [validatedDeviceId]);

  useEffect(() => {
    props.updateSimId(validatedSimId);
    if (validatedSimId !== '') {
      props?.setIncompatibleSim(false);
    }
  }, [validatedSimId]);

  useEffect(() => {
    if (ValidateDeviceSimIdResultStatus === 'fulfilled') {
      isSingleLookUpModel();
      setSimIdResult(ValidateDeviceSimIdResult);
      if (isOmniCare) {
        const deviceInfoResult = ValidateDeviceSimIdResult?.data?.serviceBody?.serviceResponse?.context?.deviceInfo;
        const skuValue = deviceInfo?.simInfo?.dfillCompatibleSim;
        const simSkuEnteredUpdate = simSkuOverride ? simSkuEntered : skuValue;
        Emitter.emit('Update_DeviceSimId_Info', { simSkuEntered: simSkuEnteredUpdate });
        setSimSkuEntered(simSkuEnteredUpdate);
        // show esim warning message as a bannerer for esim
        const simInfo = deviceInfoResult?.simInfo;
        const simInfo2 = deviceInfoResult?.simInfo2;
        if (simInfo?.eID || simInfo2?.eID) {
          displayBanner();
        }
      }
    } else if (
      ValidateDeviceSimIdResultStatus === 'rejected' &&
      ValidateDeviceSimIdResult?.error?.data?.errors?.[0]?.message === 'Sim is not compatible with the selected Device'
    ) {
      setValidatedSimId('');
      props?.setEnableBYODbtn(false);
      if (props?.isByodUpdate === 'true') {
        props?.setIncompatibleSim(true);
      }
    }
    if (window?.mfe?.scmDeviceMfeEnable && ValidateDeviceSimIdResult?.isError) {
      props?.setEnableBYODbtn(false);
    }
  }, [ValidateDeviceSimIdResult?.data, ValidateDeviceSimIdResultStatus]);

  useEffect(() => {
    if (eSimDataResults?.data?.data && eSimDataResults?.status === 'fulfilled') {
      const iccid = eSimDataResults.data.data.iccid || '';
      if (eSimDataResults?.data?.data?.mdn === props?.pairedMtn) {
        props?.setSecondNumSimId(iccid);
      } else {
        setValidatedSimId(iccid);
      }
      setdevicedata((prevData) => ({ ...prevData, eSimOnlyDevice: true }));
    }
  }, [eSimDataResults, eSimDataResults?.status]);

  useEffect(() => {
    if (deviceFromCart || (isEditAndView && isRetail())) {
      setDeviceAndSimIdHandler();
    }
  }, [deviceFromFilteredCartLine]);

  useEffect(() => {
    if (props?.ispuSim && getIspuSimEnable()) {
      const previousSim = validatedSimId;
      props?.setPreviousIspuSim(previousSim);
      setValidatedSimId(props?.ispuSim);
    }
  }, [props?.ispuToggleOn]);

  const updateCareDataOnMountAndUpdate = (mount = false) => {
    // ominn-care sim sku data update
    if (!props.isFromCPE && isOmniCare && !props.deviceSkuSelected) {
      let simSkuFromCart = '';
      let cartItemFound = false;
      props?.cartDetails?.cart?.lineDetails?.lineInfo?.forEach((line) => {
        if (line.mobileNumber === props?.activeMtn) {
          cartItemFound = true;
          const cartItem = line?.itemsInfo?.[0]?.cartItems?.cartItem;
          cartItem?.forEach((item) => {
            if (item?.cartItemType === 'SIM') {
              simSkuFromCart = scmDeviceEnable ? item?.simId : item.sorId;
            }
          });
        }
      });
      if (cartItemFound) {
        setSimSkuEntered(simSkuFromCart);
        setValidatedSimId(simSkuFromCart);
      } else if (!props.pendingOrderOnLine && isEditAndView && mount) {
        setRepSelectedSimType('omni-care');
        callValidateDeviceSku(true);
      }
    }
  };

  const displayBanner = () => {
    const eSimOstLinkAnchor = `<a target="_blank" href=${props.eSimOstLinkUrl} >here</a>`;
    const esimBannerHtml = `${props.esimEligibilityText}<div class='eSimOSTlink'>${
      props.eSimOstLinkText
    }${eSimOstLinkAnchor}&nbsp&nbsp&nbsp</div>`;
    dispatch(appMessageActions.addAppMessage(esimBannerHtml, 'warning', true, true));
  };

  const callValidateDeviceSku = (careSimOnlyValidation = false) => {
    const fromCpeDeviceSku = props.isByodUpdate || props.isFromCPE;
    const deviceId = careSimOnlyValidation ? validatedDeviceId : '';
    // adding mountApi in payload to check if the api is called on load of pdp page and if api is called on load of page we should not show esim popup
    validateDeviceSimIdRequest({
      mtn: props.activeMtn,
      deviceId,
      simId: '',
      cpSimCard: false,
      fromCpe: fromCpeDeviceSku,
      isCustomerProvidedEquipment: fromCpeDeviceSku,
      sku: '',
      simSku: simSkuEntered,
      smartIMEI: !careSimOnlyValidation,
      mountApi: careSimOnlyValidation,
    });
  };

  const handleChangeSimSku = (e) => {
    const input = e.target.value;
    setSimSkuEntered(input);
    if (!simSkuOverride) setSimSkuOverride(true);
  };

  const handleOnFocusSimSku = (e) => {
    setSimSkuOnFocus(e.target.value);
  };

  const handleOnBlurSimSku = (e) => {
    const inputValue = e.target.value;
    const inputChanged = inputValue !== '' && inputValue !== simSkuOnFocus;
    if (inputChanged) {
      const isCompatibleSim = props.compatibleSims?.filter((compatibleSim) => compatibleSim === inputValue);
      if (isCompatibleSim && isCompatibleSim.length) {
        setSimSkuEntered(inputValue);
        if (scmDeviceEnable && sessionStorage.getItem('enableSimValidation') === 'false') {
          Emitter.emit('SIM_SKU_VALIDATION', inputValue);
        } else {
          callValidateDeviceSku();
        }
      } else {
        dispatch(
          appMessageActions.addAppMessage(
            scmDeviceEnable ? 'Device and SIM are not compatible' : `Sim is not compatible with the selected Device.`,
            'error',
            true,
            false,
          ),
        );

        // this.props.inValidSimSku({ invalidSim: true });
      }
    }
  };

  useEffect(() => {
    const { isByodUpdate } = props;
    if (
      isByodUpdate &&
      isRetail() &&
      repSelectedSimType === 'physicalSim' &&
      validateDeviceSimRequest?.data?.lines?.[0]?.device?.sim?.CurrentSimid === '' &&
      (!deviceInfo.makeEtniPersApi || deviceInfo?.simClass4G === 'NP')
    ) {
      const payloadData = {
        mtn: props.activeMtn,
        deviceId: validateDeviceSimRequest?.data?.lines?.[0]?.device?.id,
        simId: validateDeviceSimRequest?.data?.lines?.[0]?.device?.sim?.id,
        cpSimCard: false,
        fromCpe: true,
        isCustomerProvidedEquipment: true,
        deviceFlow: true,
        isDWOS: false,
        sendSimFromLanding: true,
      };
      validateDeviceSimIdRequest(payloadData);
    }
  }, [repSelectedSimType]);

  /**
   * device from cart scenario handling to poppulate device and sim id on load
   */
  const setDeviceAndSimIdHandler = () => {
    let iseDeviceId = false;
    if (deviceFromFilteredCartLine) {
      let cartDeviceId = deviceFromFilteredCartLine?.deviceId;
      if (deviceFromFilteredCartLine?.eDeviceId) {
        cartDeviceId = deviceFromFilteredCartLine?.eDeviceId;
        iseDeviceId = true;
      }
      if (!secondLine) {
        setValidatedDeviceId(cartDeviceId);
      }
    }
    if (simFromFilteredCartLine) {
      let cartSimId = simFromFilteredCartLine?.simId;
      if (iseDeviceId && skipIccidCall) {
        cartSimId = '';
      } else if (iseDeviceId) {
        cartSimId = simFromFilteredCartLine?.eSIM;
      }
      setValidatedSimId(cartSimId);
    }
  };

  if (channel?.includes('OMNI-INDIRECT') && !(customerType === 'N') && !isIpad()) {
    isByodUpdateOnDekstop = !deviceIdChanged;
  }

  /* Details for Iconic Sku Start */
  const isIconicServiceSku = !!(props.sku && props.sku === 'ICONIC-SERVICE-SKU');

  const lineInfo = CustomerData?.billAccounts?.[0]?.mtns?.filter((line) => line.mtn === props.activeMtn);
  const isNewlyAddedLine = !!(
    lineInfo &&
    lineInfo.length > 0 &&
    lineInfo[0] &&
    lineInfo[0].isNewLine &&
    lineInfo[0].isNewLine === true
  );
  const activeMtnEqpInfo =
    lineInfo && lineInfo.length > 0 && lineInfo[0] && lineInfo[0].equipmentInfos && lineInfo[0].equipmentInfos[0]
      ? lineInfo[0].equipmentInfos[0]
      : {};

  const { simInfo = {} } = activeMtnEqpInfo;
  const simInfoFromLanding = simInfo && simInfo.simId ? simInfo.simId : '';
  const careDeviceIdSelected = channel === 'OMNI-CARE' && (props.deviceIdSelected || props.isFromCPE);
  const careOrTelePactRep =
    isCustomerProvidedEquipment &&
    (channel === 'OMNI-CARE' || channel === 'OMNI-TELESALES') &&
    props.cartDetails?.cart?.cartHeader?.isCoreRep
      ? props.cartDetails?.cart?.cartHeader?.isCoreRep
      : false;
  let displaySimForIconicSku = true;
  if (isIconicServiceSku === true && isNewlyAddedLine === false) {
    if (simInfoFromLanding === '') {
      displaySimForIconicSku = false;
    }
  }

  /* Details for Iconic Sku End */
  const scanFromLanding = Boolean(getQueryParamByName('scanFromLanding'));
  let upgradeIneligibleFlag = false;
  if (lineInfo && lineInfo.length > 0 && lineInfo[0] && !lineInfo[0]?.isNewLine) {
    upgradeIneligibleFlag = lineInfo[0]?.lineLevelChangeEligibility?.pendingOrderDetail !== null;
  }
  const is5GDevice = !!(
    lineInfo &&
    lineInfo.length > 0 &&
    lineInfo[0].isNewLine &&
    lineInfo[0].deviceTypeSelected === '5G Internet'
  );

  const onCheckBoxChange = () => {
    setCpeCheckbox(!cpeCheckbox);
    props.updateCpeCheckboxFlag(!cpeCheckbox);
  };

  const expandSimID = () => {
    if (isVideoAssistFlow === false || (isVideoAssistFlow === true && isRetail() && isIpad())) {
      return true;
    }
    return false;
  };

  const showSimInfo = () => {
    if (
      (updatedDeviceId || props.isLocal != null || !simProcessOnlyIpad) &&
      ((isByodUpdateOnDekstop &&
        (customerType === 'N' ||
          (props.isPrePay && customerType !== 'N') ||
          (props.isIndirect && customerType === 'E'))) ||
        !isByodUpdateOnDekstop ||
        isBYODUpdateAALRetail) &&
      !careDeviceIdSelected &&
      !isEsimOnlyDevice &&
      !disableDeviceDetailsForAsurion &&
      expandSimID()
    ) {
      return true;
    }
    return false;
  };

  const eSimPopUpData = {
    deviceInfo,
    channel: CustomerData?.channel,
    isFrom: getQueryParamByName('deviceFromCart'),

    formattedDeviceId: devicePayload?.formattedDeviceId,
    apiRequest: devicePayload, // need to check
    requestFlowType: devicePayload?.data?.lines[0]?.device?.Flowtype,

    sagaPayload: devicePayload,
    isByodUpdate: props.isByodUpdate,
    scanFromLanding: false,
    sendSimFromLanding: false,
    notRetailAndInDirect: !!(CustomerData?.channel?.indexOf('OMNI-RETAIL') === -1 && !isIndirect),
    contextUrl: getUIContextPath(),
  };

  const isSingleLookUpModel = () => {
    const { sendSimFromLanding = false } = devicePayload || {};
    const eSimOnlyEtniApi = deviceInfo?.simInfo?.makeEtniPersApi && deviceInfo?.simInfo2?.makeEtniPersApi;
    const notification =
      deviceInfo?.simInfo2 && (deviceInfo?.simInfo.makeEtniPersApi || deviceInfo?.simInfo2.makeEtniPersApi);
    const conectedDeviceNotification = deviceInfo && deviceInfo?.makeEtniPersApi && sendSimFromLanding === false;
    const dfillCompatibleSimsEmpty =
      !deviceInfo?.simInfo.dfillCompatibleSim && !deviceInfo?.simInfo2?.dfillCompatibleSim;
    const requestFlowType = validateDeviceSimRequest?.data?.lines?.[0]?.device?.Flowtype;
    const formattedDeviceId = devicePayload?.deviceId;
    const intentType = validateDeviceSimRequest?.cartInfo?.intent;
    const mtnNotGenerated = props.activeMtn?.includes('newLine');
    let simId;
    if (deviceInfo?.simInfo2?.iccid) simId = deviceInfo?.simInfo2?.iccid;
    else if (channel?.indexOf('OMNI-RETAIL') === -1 && !isIndirect) simId = deviceInfo?.simInfo2?.preferredSoftSim;
    else simId = '';
    if (mtnNotGenerated && !isCustomerProvidedEquipment) {
      dispatch(
        appMessageActions.addAppMessage(
          `Please generate MDN for the line ${props.activeMtn} to proceed`,
          'error',
          true,
          true,
          false,
          false,
          true,
          'Assign Number',
          () => {
            assignNumberRedirect();
          },
        ),
      );
    }
    /* istanbul ignore else */
    if (ValidateDeviceSimIdResult?.data) {
      if (devicePayload?.fromCpe) {
        if (notification) {
          if (eSimOnlyEtniApi && dfillCompatibleSimsEmpty) {
            if (!devicePayload?.mountApi) {
              setIsSingleSimEntiLookupModalVisibleByod(true);
            }
            if (isOmniCare && !scmDeviceEnable) {
              const msg =
                'We can not proceed further with eSim in this flow, please select physical sim or Please access the following path in ACSS to complete an add a line order when the customer is using an existing device and SIM/eSIM: Devices tab> Links/Action> Add line/CPE(NSO)';
              dispatch(appMessageActions.addAppMessage(msg));
            }
            const vzdl = window?.vzdl || {};
            if (vzdl?.event) vzdl.event.value = 'event24';
            window.vzdl = vzdl;
            sendCustomEvent('openView', window?.vzdl);
          } else {
            if (!repSelectedSimType) {
              setIsDualSimEntiLookupModalVisible(true);
            }
            const vzdl = window?.vzdl || {};
            if (vzdl?.event) vzdl.event.value = 'event24';
            window.vzdl = vzdl;
            sendCustomEvent('openView', window?.vzdl);
          }
        } else if (conectedDeviceNotification) {
          if (!devicePayload?.mountApi) {
            setIsSingleSimEntiLookupModalVisibleByod(true);
          }
          const vzdl = window?.vzdl || {};
          if (vzdl?.event) vzdl.event.value = 'event24';
          window.vzdl = vzdl;
          sendCustomEvent('openView', window?.vzdl);
        } else {
          const simIdFromResponse = deviceInfo?.simInfo?.iccid && !sendSimFromLanding ? deviceInfo?.simInfo?.iccid : '';
          if (simIdFromResponse) {
            setValidatedSimId(simIdFromResponse);
          }
          if (!!getQueryParamByName('eSim') && deviceInfo?.makeEtniPersApi === false && isRetail()) {
            navigate(
              `${getUIContextPathBAU()}/product-detail.html?$iSscan=true&offerEligible=Y&activeMtn=${
                props?.activeMtn
              }&deviceSKU=${deviceInfo?.deviceSku}&${
                props?.isByodUpdate ? 'isByodUpdate=true' : 'isFromCPE=true'
              }&deviceId=${validatedDeviceId}&mtn=${props?.activeMtn}&simId=${deviceInfo?.simInfo?.iccid}${
                props?.prospectByodFlow ? '&prospectByodFlow=true&ByodDeviceCompitable=true' : ''
              }&ispuCompatibleSIM=${deviceInfo?.simInfo?.ispuCompatibleSIM}`,
            );
          }
        }
        // condition for pSim only devices to make second validatedevicesim id call (BYOD flow)
        if (!notification && !deviceInfo?.simInfo2?.makeEtniPersApi && !deviceInfo?.simInfo?.makeEtniPersApi) {
          setRepSelectedSimType('physicalSim');
        }
      }
      if (sendSimFromLanding === false) {
        if (
          deviceInfo?.simClass4G === 'NP' &&
          (channel?.includes('OMNI-RETAIL') || channel?.includes('OMNI-INDIRECT')) &&
          deviceInfo?.simInfo2
        ) {
          setdevicedata({
            eSimOnlyDevice: !!(deviceInfo?.makeEtniPersApi && !deviceInfo?.simInfo?.dfillCompatibleSim),
            skuId:
              deviceInfo?.simInfo2?.launchPackageSku ||
              deviceInfo?.simInfo2?.launchPackageSkuType ||
              deviceInfo?.deviceSku,
            imei1: deviceInfo?.imei1,
            skuDisplayName: deviceInfo?.simInfo2?.skuDisplayName ? deviceInfo?.simInfo2?.skuDisplayName : '',
            deviceId: deviceInfo?.simInfo2?.deviceId,
            simId,
            simLocalId: deviceInfo?.simInfo2?.iccid,
            fmipLocked: deviceInfo?.simInfo2?.fmipLocked,
            manualEntrySimId: devicePayload?.simId ? devicePayload?.simId : '',
            cpSimCard:
              ((channel === 'OMNI-TELESALES' || channel === 'OMNI-CARE' || channel === 'CHAT-STORE') &&
                devicePayload?.simId &&
                true) ||
              (requestFlowType === 'DEVICE' && deviceInfo.simInfo2.iccid && true) ||
              devicePayload?.cpSimCard, // If the device has inbuilt sim, set customerProvidedSim as true
            cpSimCheckboxSelected: devicePayload?.cpSimCard,
            eid: deviceInfo?.simInfo2?.eID,
            eid2: deviceInfo?.pairedImeiData?.eid || '',
            launchPackageSku: requestFlowType === 'SIM' ? deviceInfo?.simInfo2?.launchPackageSku || '' : '',
            preferredSoftSim: deviceInfo?.simInfo2?.preferredSoftSim ? deviceInfo?.simInfo2?.preferredSoftSim : '',
            ispuCompatibleSIM: deviceInfo?.simInfo2?.ispuCompatibleSIM ? deviceInfo?.simInfo2?.ispuCompatibleSIM : '',
            etniApi: deviceInfo?.simInfo2 ? false : deviceInfo?.makeEtniPersApi,
            currentSimIdInRequest: formattedDeviceId ? devicePayload?.data?.lines?.[0]?.device?.sim?.CurrentSimid : '',
            scanFromPDPLocalFlow: !!(
              props?.isLocal &&
              scanFromLanding === false &&
              !devicePayload?.fromCpe &&
              !devicePayload?.isCustomerProvidedEquipment &&
              !props?.isByodUpdate
            ),
            pDeviceId: deviceInfo?.simInfo ? deviceInfo?.simInfo?.deviceId : '',
            simClass4G: deviceInfo?.simClass4G,
            intentType,
            physicalSku: deviceInfo?.deviceSku,
            physicalSimSku: deviceInfo?.simInfo?.dfillCompatibleSim || '',
            eDeviceId: deviceInfo?.simInfo2?.deviceId || '',
          });
        } else {
          // eSim data
          setdevicedata({
            eSimOnlyDevice: !!(deviceInfo?.makeEtniPersApi && !deviceInfo?.simInfo?.dfillCompatibleSim),
            skuId: deviceInfo?.deviceSku,
            skuDisplayName: deviceInfo?.skuDisplayName,
            imei1: deviceInfo?.imei1,
            deviceId: deviceInfo?.deviceId,
            simId: deviceInfo?.simInfo?.iccid ? deviceInfo?.simInfo?.iccid : deviceInfo?.simInfo?.preferredSoftSim,
            simLocalId: deviceInfo?.simInfo?.iccid,
            fmipLocked: deviceInfo?.fmipLocked,
            manualEntrySimId: devicePayload?.simId,
            cpSimCard:
              ((channel === 'OMNI-TELESALES' || channel === 'OMNI-CARE' || channel === 'CHAT-STORE') &&
                devicePayload?.simId &&
                true) ||
              (requestFlowType === 'DEVICE' && deviceInfo?.simInfo?.iccid && true) ||
              devicePayload?.cpSimCard, // If the device has inbuilt sim, set customerProvidedSim as true
            cpSimCheckboxSelected: devicePayload?.cpSimCard,
            eid: deviceInfo?.simInfo?.eID,
            eid2: deviceInfo?.pairedImeiData?.eid || '',
            launchPackageSku: requestFlowType === 'SIM' ? deviceInfo?.simInfo?.launchPackageSku || '' : '',
            preferredSoftSim: deviceInfo?.simInfo?.preferredSoftSim ? deviceInfo?.simInfo?.preferredSoftSim : '',
            ispuCompatibleSIM: deviceInfo?.simInfo?.ispuCompatibleSIM ? deviceInfo?.simInfo?.ispuCompatibleSIM : '',
            etniApi: deviceInfo?.simInfo2 ? false : deviceInfo?.makeEtniPersApi,
            currentSimIdInRequest: formattedDeviceId ? devicePayload?.data?.lines?.[0]?.device?.sim?.CurrentSimid : '',
            scanFromPDPLocalFlow: !!(
              props?.isLocal &&
              scanFromLanding === false &&
              !devicePayload?.fromCpe &&
              !devicePayload?.isCustomerProvidedEquipment &&
              !props?.isByodUpdate
            ),
          });
        }
      }
      if (intentType === 'EUP' || ((intentType === 'AAL' || intentType === 'NSE') && !devicePayload.fromCpe)) {
        // NON BYOD or LOCAL FLOW ESIM
        if (
          deviceInfo?.simInfo2 ||
          deviceInfo?.makeEtniPersApi ||
          (devicedata?.etniApi === true && devicedata?.deviceId === devicePayload.deviceId)
        ) {
          setIsSingleSimEntiLookupModalVisibleByod(true);
          if (devicePayload?.deviceId)
            if (!secondLine) {
              setValidatedDeviceId(devicePayload?.deviceId);
            }
          const vzdl = window?.vzdl || {};
          if (vzdl?.event) vzdl.event.value = 'event24';
          window.vzdl = vzdl;
          sendCustomEvent('openView', window?.vzdl);
        } else {
          // NON BYOD or LOCAL FLOW  NON ESIM
          if (devicePayload?.deviceId) {
            if (!secondLine) {
              setValidatedDeviceId(devicePayload?.deviceId);
            }
          }
          if (devicePayload?.simId) {
            setValidatedSimId(devicePayload?.simId);
          }
        }
      }
      if (
        deviceInfo?.deviceId === props?.lineDeviceIdFromLanding &&
        deviceInfo?.simInfo?.iccid === props?.lineSimIdFromLanding
      ) {
        setValidatedSimId(deviceInfo?.simInfo?.iccid);
        props?.setEnableBYODbtn(false);
      } else if (
        deviceInfo?.deviceId === props?.lineDeviceIdFromLanding &&
        deviceInfo?.simInfo?.iccid !== props?.lineSimIdFromLanding &&
        (channel.includes('RETAIL') || channel.includes('TELESALES'))
      ) {
        setValidatedSimId(deviceInfo?.simInfo?.iccid);
        props?.setEnableBYODbtn(true);
      } else if (
        props.isByodUpdate === 'true' &&
        channel.includes('RETAIL') &&
        deviceInfo?.deviceSimCompatible === 'Y' &&
        validateDeviceSimRequest?.data?.lines?.[0]?.device?.sim?.CurrentSimid !== '' &&
        validateDeviceSimRequest?.data?.lines?.[0]?.device?.sim?.id === ''
      ) {
        // Device SIM Compatible toast message
        setValidatedSimId(validateDeviceSimRequest?.data?.lines?.[0]?.device?.sim?.CurrentSimid);
        props?.setEnableBYODbtn(true);
        dispatch(appMessageActions.addAppMessage('CurrentSIM is compatible with new device', 'success', true, true));
      } else if (deviceInfo?.deviceSimCompatible === 'N' && deviceInfo?.simInfo?.iccid !== '') {
        dispatch(
          appMessageActions.addAppMessage('Sim is not compatible with the selected device', 'error', true, true),
        );
        props?.setEnableBYODbtn(true);
        if (props?.isByodUpdate === 'true') {
          props?.setIncompatibleSim(true);
        }
      } else if (
        props.isByodUpdate === 'true' &&
        (deviceInfo?.deviceSimCompatible === 'Y' || deviceInfo?.deviceSimCompatible === '')
      ) {
        props?.setEnableBYODbtn(true);
      } else if (deviceInfo?.deviceSimCompatible === 'N' && deviceInfo?.simInfo?.iccid === '') {
        props?.setEnableBYODbtn(true);
      }
    }
  };

  const validateDeviceSimIdRequest = (payload) => {
    setSecondLine(payload?.isSecondNumLine);
    const isByodUpdate = !!getQueryParamByName('isByodUpdate') || props.isByodUpdate;
    const isPrepayCart = props.cartDetails?.cart?.orderDetails?.isPrePayCart || 'N';
    const lineSimDetailsFromLanding =
      activeMtnEqpInfo?.simInfo?.simId &&
      activeMtnEqpInfo?.simInfo?.simId !== '' &&
      activeMtnEqpInfo?.simInfo?.simId !== null &&
      activeMtnEqpInfo?.simInfo?.simId !== undefined
        ? activeMtnEqpInfo?.simInfo?.simId
        : '';
    const lineDeviceDetailsFromLanding =
      activeMtnEqpInfo?.deviceInfo?.deviceId &&
      activeMtnEqpInfo?.deviceInfo?.deviceId !== '' &&
      activeMtnEqpInfo?.deviceInfo?.deviceId !== null &&
      activeMtnEqpInfo?.deviceInfo?.deviceId !== undefined
        ? activeMtnEqpInfo?.deviceInfo?.deviceId
        : '';
    const intendType = !isEmpty(lineInfo) && lineInfo?.[0]?.lineActivityType ? lineInfo?.[0]?.lineActivityType : 'EUP';
    const isNewLine = !!(intendType && intendType === 'AAL');
    const mtnType = !isEmpty(lineInfo) && lineInfo?.[0]?.mtnDetails?.mtnType ? lineInfo?.[0]?.mtnDetails?.mtnType : '';
    let flowType;
    if (payload.deviceFlow) flowType = 'DEVICE';
    else if ((payload.simId && payload.simId !== ' ') || (isOmniCare && payload?.simSku)) flowType = 'SIM';
    else flowType = 'DEVICE';
    const formattedDeviceId = payload.deviceId ? payload.deviceId : '';
    const formattedSimId = payload.simId ? payload.simId : '';
    const { cpSimCard, sendSimFromLanding } = payload;
    const { homeSalesAddress = {} } = CustomerData || {};
    const { bundles = [] } = homeSalesAddress;
    const sku = payload.sku ? payload.sku : '';
    const smartIMEI = payload.smartIMEI || false;
    const simSku = payload.simSku ? payload.simSku : '';
    const cpeWthoutDevIdFlag = payload.cpeWthoutDevIdFlag ? payload.cpeWthoutDevIdFlag : false;
    const fiveGDetails =
      !isEmpty(lineInfo) &&
      lineInfo?.filter((line) => line?.deviceTypeSelected && line?.deviceTypeSelected === '5G Internet');
    const deviceIdFromQuery = isByodUpdate && getQueryParamByName('deviceId') ? getQueryParamByName('deviceId') : '';
    const simIdFromQuery = isByodUpdate && getQueryParamByName('simId') ? getQueryParamByName('simId') : '';
    const isFiveG = fiveGDetails?.length > 0;
    const simIdQueryParam = getQueryParamByName('simId') ? getQueryParamByName('simId') : '';
    const getCurrentSimId = lineSimDetailsFromLanding || simIdQueryParam;
    let intent;
    if (customerType === 'N' && isCustomerProvidedEquipment) intent = 'NSEBYOD';
    else if (customerType === 'N') intent = 'NSE';
    else if (isPrepayCart === 'Y' && customerType !== 'N' && isCustomerProvidedEquipment) intent = 'BYOD';
    else if (isFiveG === true) intent = '5GHome';
    else if (isCustomerProvidedEquipment) intent = 'BYOD';
    else if (isNewLine) intent = 'AAL';
    else intent = 'EUP';
    let CurrentSimid;
    if (sendSimFromLanding) CurrentSimid = lineSimDetailsFromLanding;
    else if (flowType === 'SIM' && isMitekSimSwapEnabled === 'TRUE') CurrentSimid = getCurrentSimId;
    else if (isByodUpdate === true) CurrentSimid = '';
    else CurrentSimid = simIdFromQuery;

    // For new customer flow we are setting currentSimid as empty CXTDT-595283
    if (customerType === 'N') CurrentSimid = '';

    let device;
    if (isFiveG === true && bundles?.bundleName?.includes('5GHomeSelfInstall')) {
      device = {
        Flowtype: 'GIFTBOX',
        giftbox: {
          id: formattedDeviceId,
        },
      };
    } else if (!cpeWthoutDevIdFlag) {
      device = {
        id: formattedDeviceId,
        Flowtype: flowType,
        CurrentId:
          isByodUpdate === true &&
          lineDeviceDetailsFromLanding &&
          lineDeviceDetailsFromLanding !== '' &&
          lineDeviceDetailsFromLanding !== formattedDeviceId
            ? lineDeviceDetailsFromLanding
            : deviceIdFromQuery,
        isCustomerProvidedEquipment,
        sku,
        smartIMEI,
        sim: {
          id: formattedSimId,
          sku: simSku,
          isCustomerProvidedSIM: cpSimCard,
          CurrentSimid,
        },
      };
    }

    const validateDeviceRequestBody = {
      cartInfo: {
        creditAppNum: null, // Todo for PDP page
        processingMTN: payload?.activeMtn ? payload?.activeMtn : payload?.mtn,
        intent,
        processStep: isCustomerProvidedEquipment ? 'BYODDeviceIDPage' : 'GridWallPDP',
        processAction: isFiveG === true ? 'validateGiftBoxId' : 'validateDeviceSim',
        action: '',
        locationCode: CustomerData?.orderLocationCode,
      },
      data: {
        lines: [
          {
            mtn: payload?.activeMtn ? payload?.activeMtn : payload?.mtn,
            mtnType,
            eskuId: payload.eskuId || '',
            device,
          },
        ],
      },
      disableEsimAtLocalInventory: false,
    };
    validateDeviceSimIdRequestBody({ body: validateDeviceRequestBody });
    setValidateDeviceSimRequest(validateDeviceRequestBody);
    setDevicePayload(payload);
    setPopUp(!popUp);
  };

  const updateDevicePayload = (payload) => {
    setDevicePayload((previouspayload) => ({ ...previouspayload, ...payload }));
    setdevicedata(payload);
    setValidatedDeviceId(payload?.deviceId);
    const isPsimSelected = payload?.selectedRadioButton === 'physicalSim';
    if (isPsimSelected) {
      props?.updateSimId('');
      // for retail pSim scenario by default sim input filed will be empty
      const setSimId = isRetail() ? '' : payload?.preferredSoftSim;
      if (scmDeviceEnable && isPsimSelected) {
        setValidatedSimId('');
      } else {
        setValidatedSimId(setSimId);
      }
    }
  };

  const updateSetUpPopUp = () => {
    setPopUp(!popUp);
  };

  const isDualSimEntiLookupModalVisibleUpdate = (isCloseModalSelected) => {
    if (window?.mfe?.scmDeviceMfeEnable && isCloseModalSelected) {
      setRepSelectedSimType('');
      setValidatedSimId('');
    }
    setIsDualSimEntiLookupModalVisible(!isDualSimEntiLookupModalVisible);
  };

  const initSimDetailsCall = () => {
    const updatedSimInfo =
      deviceInfo?.simInfo?.eID && deviceInfo?.simInfo?.makeEtniPersApi ? deviceInfo?.simInfo : deviceInfo?.simInfo2;
    const cartLines = props?.cartDetails?.cart?.lineDetails?.lineInfo || [];
    const lineInformation = cartLines?.filter((line) => line?.mobileNumber === props?.activeMtn);
    const isMtnTypePortIn = lineInformation[0]?.portinMtnAssignment || false;
    const isActiveLineMtnType = lineInformation[0]?.mtnDetails?.mtnType
      ? lineInformation[0]?.mtnDetails?.mtnType.toUpperCase()
      : '';
    const isMtnTypePreToPost = isActiveLineMtnType === MTN_TYPE_PRE_TO_POST;
    const isMtnTypeVisible = isActiveLineMtnType === MTN_TYPE_VISIBLE;
    const isMtnTypeYahoo = isActiveLineMtnType === MTN_TYPE_YAHOO;
    const isMtnTypeHarmony = isActiveLineMtnType === MTN_TYPE_HARMONY;
    const isPrepayCart = props.cartDetails?.cart?.orderDetails?.isPrePayCart || 'N';
    const intendType =
      lineInformation?.length > 0 && lineInformation?.[0]?.lineActivityType
        ? lineInformation?.[0]?.lineActivityType
        : 'EUP';
    const isNewLine =
      intendType && (intendType === 'AAL' || intendType === 'NSE' || intendType === 'BYOD' || intendType === 'NSEBYOD');
    const billingSystemFromCart = props.cartDetails?.cart?.orderDetails?.billingSystem ?? '';
    let billerId = '';
    if (CustomerData?.billingSystem) {
      billerId = CustomerData.billingSystem;
    } else if (billingSystemFromCart) {
      billerId = billingSystemFromCart;
    } else if (props.prospectByodFlow && props.cartDetails?.cart?.orderDetails?.billingSystem) {
      billerId = props.cartDetails?.cart?.orderDetails?.billingSystem;
    }
    const eSimRequestBody = {
      billerId,
      mdn: secondLine ? props?.pairedMtn : props.activeMtn,
      sku: updatedSimInfo?.preferredSoftSim,
      eid: updatedSimInfo?.eID,
      processInd: isNewlyAddedLine || isNewLine ? 'N' : 'D',
    };
    /* istanbul ignore else */
    // No else statement to cover
    if (
      isMtnTypePreToPost ||
      isMtnTypeVisible ||
      isMtnTypeYahoo ||
      isMtnTypeHarmony ||
      isMtnTypePortIn ||
      isPrepayCart === 'Y'
    ) {
      eSimRequestBody.processInd = 'M';
    }
    eSimData({ body: eSimRequestBody });
  };

  const onClickEntiLookupOption = (option) => {
    if (option === 'yes') {
      setIsSingleSimEntiLookupModalVisibleByod(!isSingleSimEntiLookupModalVisibleByod);
      if (!skipIccidCall && !props?.isSecNumValidation) initSimDetailsCall();
      updateSetUpPopUp();
      props.setEnableBYODbtn(true);
      if (props?.isSimultaneousUpgrade) {
        setIsSecNumValidation(!props?.isSecNumValidation);
      }
    } else if (option === 'no') {
      setIsSingleSimEntiLookupModalVisibleByod(!isSingleSimEntiLookupModalVisibleByod);
      updateSetUpPopUp();
      if (!scmDeviceEnable) {
        if (getQueryParamByName('fromPage') === 'combinedgridwall' && isOmniCare) {
          navigate(`${getUIContextPathBAU()}/combinedgridwall.html?activeMtn=${props.activeMtn}`);
        } else {
          navigate(`${getUIContextPathBAU()}/landing.html`);
        }
      }
    }
  };

  const handleChangeSimID = (e, ivrSimID) => {
    if ((e && e.target && e.target.value) || ivrSimID) {
      const input = ivrSimID || e.target.value;
      setValidatedSimId(input);
    } else if (e && e.target && e.target.value === '') {
      setValidatedSimId(e.target.value);
    }
  };

  const updateDfillSimId = (simId) => {
    setValidatedSimId(simId);
  };

  const allowOnlyNumbers = (value) => {
    const rE = /^[0-9\b]+$/;
    return value === '' || rE.test(value);
  };

  const handleChangeDeviceIDs = (e) => {
    let txtfieldVal;
    if (e && e.target && e.target.value) {
      const input = e.target.value;
      setValidatedDeviceId(input);
      if (allowOnlyNumbers(e.target.value) && e.target.value.length <= 15) {
        if (e.target.value.length === 15) {
          txtfieldVal = e.target.value;
          setValidatedDeviceId(input);
          setDeviceIdChanged(true);
        }
      } else {
        e.target.value = txtfieldVal || '';
      }
    } else if (e && e.target && e.target.value === '') {
      setValidatedDeviceId(e.target.value);
      // will override eSimDevice id if user clears the device id
      setDeviceIdEsimCheck('');
    }
  };
  const handleGetUpdateOldSimId = (data) => {
    const currentSimIdInRequest = validateDeviceSimRequest?.data?.lines?.[0]?.device?.CurrentSimid;
    const queryParamSim = getQueryParamByName('simId') ? getQueryParamByName('simId') : '';
    const currentSimId = currentSimIdInRequest || queryParamSim;
    const msg =
      '&#9888; This account is currently restricted. Please exit and re-access the account using Adaptive Authentication.';
    setValidatedSimId(currentSimId);
    props?.simSwapFlowUpdateButtonDisabled(true);
    if (data === 'NotApproved') {
      setSimDisabled(true);
      dispatch(appMessageActions.clearAppMessages());
      dispatch(appMessageActions.addAppMessage(msg, 'warning', true, false));
    }
  };
  const idScanModalValue = (data) => {
    setIdScanModalOpen(data);
  };

  const handleModelChange = (data) => {
    setIdScanModalOpen(data);
    dispatch(appMessageActions.clearAppMessages());
    dispatch(appMessageActions.addAppMessage('Device ID is updated successfully', 'success', true, false));
  };

  const disableUpdate = () => {
    props?.simSwapFlowUpdateButtonDisabled(true);
  };
  const closeModal = () => {
    setIdScanModalOpen(false);
  };
  const handleChangeSimIDFlow = (e) => {
    if (window?.mfe?.scmDeviceMfeEnable) handleChangeSimID(e);
  };
  // if sim input field is disaabled and desktop then show label message
  const showSimProcessingMsg = () => !showSimInfo() && !isIpad();
  // hide sim are if skipICCID: "TRUE" for edit scenario
  const isEsimRetrieveCartFlow = (deviceFromCart || isEditAndView) && simFromFilteredCartLine?.eSIM;
  const isESimFromUrl = Boolean(getQueryParamByName('eSim'));
  const isEIDVal = devicedata?.eid;
  const eSimEtniApi = devicedata?.eSimEtniApi;
  const etniApi = devicedata?.etniApi;
  const isEsimFlow = !isEmpty(devicedata)
    ? (etniApi || eSimEtniApi || devicedata?.eSimOnlyDevice) && isEIDVal
    : isESimFromUrl;
  let shouldDisplayESIMMessage = false;
  if (
    (isEmpty(validatedSimId) && (isEsimRetrieveCartFlow || isEsimFlow) && skipIccidCall) ||
    (devicedata?.eSimEtniApi && devicedata?.eid !== '' && skipIccidCall)
  ) {
    shouldDisplayESIMMessage = true;
  }

  // conditions to hide sim area as per cradle props
  const byodDeviceCheck =
    isCustomerProvidedEquipment || scanFromLanding || localScan
      ? isEsimOnlyDevice
      : !isEmpty(devicedata) && devicedata?.eid !== '';
  const byodDualSimCheck = isCustomerProvidedEquipment && !!getQueryParamByName('eSim');
  const hideSIMArea =
    (isEmpty(validatedSimId) && (isEsimRetrieveCartFlow || isEsimFlow) && skipIccidCall) ||
    ((byodDeviceCheck || byodDualSimCheck) && skipIccidCall);

  const isSecondNumDfill = sessionStorage.getItem('isSecondNumDfill');
  const alowedTypes = ['AAL', 'NSE', 'BYOD', 'NSEBYOD'];
  const propsLineActivityType = props?.lineActivityType;
  let isSimEnabled = false;
  if (window?.mfe?.scmDeviceMfeEnable && repSelectedSimType === 'eSim') {
    isSimEnabled = true;
  }
  return (
    !isSecondNumDfill && (
      <div data-testid='DeviceSimID'>
        {isTelesales() && props.isByodUpdate && (
          <DivWrapper>
            <DisplayWrapper className='u-textBold'>Device and SIM processing are available only on iPad</DisplayWrapper>
          </DivWrapper>
        )}
        <DeviceWrapper>
          {
            careDeviceIdSelected || channel !== 'OMNI-CARE' ? (
              <SIMIDWrapper>
                {!disableDeviceDetailsForAsurion && (
                  <DeviceScan
                    setRepSelectedSimType={setRepSelectedSimType}
                    deviceIdEsimCheck={deviceIdEsimCheck}
                    shouldDisplayESIMMessage={shouldDisplayESIMMessage}
                    isPdpPage
                    ScanFromLanding={false}
                    upgradeIneligibleFlag={upgradeIneligibleFlag}
                    sku={props.sku}
                    isCancel={(val) => props.isCancel(val)}
                    addressValidation={props.addressValidation}
                    homeSalesBundles={props.homeSalesBundles}
                    isCustomerProvidedEquipment={isCustomerProvidedEquipment}
                    validateDeviceSimIdRequest={validateDeviceSimIdRequest}
                    handleChangeDeviceIDs={(e) => handleChangeDeviceIDs(e)}
                    deviceId={validatedDeviceId || ''}
                    fromCpe={isCustomerProvidedEquipment}
                    showScanner={showScanner}
                    isWSAPCpeError={props.isWSAPCpeError}
                    cpeDeviceId={props.cpeDeviceId}
                    cpeCheckboxFlag={props.cpeCheckboxFlag}
                    isIndirect={props.isIndirect}
                    LineDeviceId={props.lineDeviceIdFromLanding}
                    getHomeSalesAddressDetails={props.getHomeSalesAddressDetails}
                    qualificationDetails={props.getQualificationDetails}
                    LandingCband={props.LandingCband}
                    Landingltequalified={props.Landingltequalified}
                    LandingFiveGHomeQualified={props.LandingFiveGHomeQualified}
                    appPropertiesFromSessionStorage={props.appPropertiesFromSessionStorage}
                    customerType={props.customerType}
                    creditAppNumber={props.creditAppNumber}
                    is5GDevice={is5GDevice}
                    isPaymentOptionVisible={props.isPaymentOptionVisible}
                    updateEsimDialogBoxButtons={props.updateEsimDialogBoxButtons}
                    isByodUpdate={props.isByodUpdate}
                    CustomerData={CustomerData}
                    activeMtn={props.activeMtn}
                    isFromPDPPage
                    isNewlyAddedLine={props?.isNewlyAddedLine}
                  />
                )}
                {(isPearl ||
                  (!disableDeviceDetailsForAsurion && (isByodUpdateOnDekstop || props.isByodUpdate) && isRetail)) && (
                  <CheckboxWrapper>
                    <Checkbox
                      type='checkbox'
                      name='SIMCardProvided'
                      className='cpe-checkbox'
                      selected={cpeCheckbox}
                      checked={cpeCheckbox}
                      disabled={!props.isWSAPCpeError}
                      onChange={() => onCheckBoxChange()}
                      label='This device is customer-provided equipment'
                      data-track='Productdetail_cpe-checkbox'
                    />
                  </CheckboxWrapper>
                )}
              </SIMIDWrapper>
            ) : (
              <InputWrapper>
                <SIMIDWrapper>
                  <Input
                    type='text'
                    iconName=''
                    name='deviceSku'
                    id='deviceSku'
                    placeholder='Enter Device SKU'
                    label='Device SKU'
                    value={validatedDeviceId}
                    // onChange={e => this.handleChangeDeviceSKU(e)}
                    // onBlur={e => this.handleOnBlurDeviceSKU(e)}
                    disabled
                  />
                </SIMIDWrapper>
              </InputWrapper>
            ) // To do for Omni-Care Sku selection
          }
          <InputWrapper>
            {(skipIccidCall && isEsimOnlyDevice) || hideSIMArea ? (
              <> </>
            ) : (
              <SIMIDWrapper>
                {
                  // eslint-disable-next-line no-nested-ternary
                  (props.isByodUpdate &&
                    channel?.indexOf('OMNI-RETAIL') === -1 &&
                    !isIndirect &&
                    !scmDeviceEnable &&
                    (validatedSimId === 'null' || validatedSimId === '') &&
                    !isBYODUpdateAALRetail) ||
                  props.isDWOS === true ||
                  displaySimForIconicSku === false ? (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <></>
                  ) : (careDeviceIdSelected && !careOrTelePactRep) || channel !== 'OMNI-CARE' ? (
                    <>
                      <IpadSimContent>
                        {!showSimInfo() ? (
                          <InputWrapper>
                            <Input
                              name='simId'
                              id='simId'
                              placeholder='Enter Sim ID'
                              value={validatedSimId}
                              onChange={(e) => {
                                handleChangeSimIDFlow(e);
                              }}
                              data-testid='handleChangeSimID'
                              required
                              disabled={isSimEnabled}
                              label='Enter Sim ID'
                              data-track='Productdetail_simId'
                            />
                          </InputWrapper>
                        ) : (
                          ''
                        )}
                        {(simProcessOnlyIpad || showSimProcessingMsg()) &&
                          channel !== 'OMNI-CARE' &&
                          isVideoAssistFlow === false &&
                          channel !== 'OMNI-TELESALES' && (
                            <DivWrapper>
                              <span className='u-textBold'>
                                SIM processing only available on iPad {props.deviceIdSelected}
                              </span>
                            </DivWrapper>
                          )}
                        {isVideoAssistFlow === true && !(isRetail && isIpad()) && (
                          <DivWrapper>
                            <span className='u-textBold'>
                              SIM processing and device changes are not available during Video Assists or Outbound Leads
                            </span>
                          </DivWrapper>
                        )}
                        {isEsimOnlyDevice && (
                          <DivWrapper>
                            <span className='u-textBold'>Cannot change for eSIM only devices</span>
                          </DivWrapper>
                        )}
                      </IpadSimContent>
                      {showSimInfo() ? (
                        // eslint-disable-next-line react/jsx-no-useless-fragment
                        <>
                          {!props.isDWOS && displaySimForIconicSku === true && (
                            <InputWrapper>
                              <SIMIDWrapper>
                                <SimScan
                                  isCustomerProvidedEquipment={isCustomerProvidedEquipment}
                                  validateDeviceSimIdRequest={validateDeviceSimIdRequest}
                                  deviceId={validatedDeviceId || ''}
                                  handleChangeSimID={(e, ivrSimId) => handleChangeSimID(e, ivrSimId)}
                                  fromCpe={isCustomerProvidedEquipment}
                                  isLocal={props.isLocal}
                                  simId={validatedSimId || ''}
                                  showScanner={showScanner}
                                  updateDfillSimId={updateDfillSimId}
                                  isDeviceBuyout={props.isDeviceBuyout}
                                  updateShowISPUForVA={props.updateShowISPUForVA}
                                  isVideoAssistFlow={props.isVideoAssistFlow}
                                  getDeviceData={props.getDeviceData}
                                  simDisabled={simDisabled}
                                  channel={channel}
                                  deviceInfo={deviceInfo}
                                  validateDeviceSimRequest={validateDeviceSimRequest}
                                  is5GDevice={is5GDevice}
                                  isPaymentOptionVisible={props?.isPaymentOptionVisible}
                                  cartDetails={props?.cartDetails}
                                  customerProfileDetails={props?.customerProfileDetails}
                                  correlationId={correlationId}
                                  handleGetUpdateOldSimId={handleGetUpdateOldSimId}
                                  simSwapFlowUpdateButtonDisabled={props?.simSwapFlowUpdateButtonDisabled}
                                  setMitekIdVerifyStatus={props?.setMitekIdVerifyStatus}
                                  activeMtn={props.activeMtn}
                                  isNewlyAddedLine={props?.isNewlyAddedLine}
                                  isByodUpdate={props?.isByodUpdate}
                                />
                              </SIMIDWrapper>
                            </InputWrapper>
                          )}
                        </>
                      ) : (
                        ''
                      )}
                      {careDeviceIdSelected && props.isFromCPE && isEsimOnlyDevice && (
                        <DisplayWrapper>
                          <span className='u-marginBottom u-textBold'>{props.careUsingExistingSimNote}</span>
                        </DisplayWrapper>
                      )}
                    </>
                  ) : (
                    <InputWrapper>
                      <SIMIDWrapper>
                        <Input
                          type='text'
                          iconName=''
                          name='simId'
                          id='simId'
                          data-testid='simId'
                          value={simSkuEntered}
                          placeholder='Enter SIM ID'
                          label='Sim SKU'
                          onBlur={(e) => handleOnBlurSimSku(e)}
                          onChange={(e) => handleChangeSimSku(e)}
                          onFocus={(e) => handleOnFocusSimSku(e)}
                          autoComplete='off'
                          // value={this.state.deviceId || this.props.selectedDeviceId || ""}
                          // onChange={e => this.handleChangeDeviceID(e)}
                          // onBlur={e => this.handleOnBlurDeviceID(e)}
                          // disabled={channelName === "OMNI-INDIRECT" && this.props.isDeviceFromCart}
                          // error={this.state.simError}
                          // errorText={this.state.simError ? simErrorMsg : ""}
                        />
                      </SIMIDWrapper>
                    </InputWrapper>
                  ) // To do for Omni-Care Sku selection
                }
              </SIMIDWrapper>
            )}
          </InputWrapper>
        </DeviceWrapper>
        {props?.isSimultaneousUpgrade && (
          <>
            <HorizontalLine />
            <SecondLineDeviceId
              {...props}
              isSecNumValidation={props?.isSecNumValidation}
              pairedMtn={props?.pairedMtn}
              validateDeviceSimIdRequest={validateDeviceSimIdRequest}
              deviceInfo={deviceInfo}
            />
          </>
        )}
        {isDualSimEntiLookupModalVisible && (
          <ESim
            lineActivityType={props?.lineActivityType}
            isPdpPage
            eSimModelData={eSimPopUpData}
            totalLines={lineInfo}
            updateDevicePayload={updateDevicePayload}
            activeMtn={props.activeMtn}
            sourcefrom='combinedgridwall'
            initSimDetailsCall={initSimDetailsCall}
            isDualSimEntiLookupModalVisible={isDualSimEntiLookupModalVisible}
            isDualSimEntiLookupModalVisibleUpdate={isDualSimEntiLookupModalVisibleUpdate}
            updateSetUpPopUp={updateSetUpPopUp}
            ProspectByodFlow={false}
            scanCheck={scanCheck}
            deviceInfo={deviceInfo}
            idScanModalValue={(value) => idScanModalValue(value)}
            setRepSelectedSimType={setRepSelectedSimType}
          />
        )}
        {isSingleSimEntiLookupModalVisibleByod && (
          <ConfirmationDialogBox
            data-testid='confirmationBox'
            message='This device requires an eSim for activation, do you wish to continue?'
            btnYesText='Yes'
            btnNoText='No'
            isNoBtnDisabled={false}
            isYesBtnDisabled={isOmniCare && !scmDeviceEnable && !alowedTypes.includes(propsLineActivityType)}
            handleConfirmationDialogBoxClick={(val) => {
              onClickEntiLookupOption(val);
            }}
          />
        )}
        {isIdScanModalOpen && (
          <IDScanModal
            isOpen={isIdScanModalOpen}
            handleModelChangeEsimFlow={handleModelChange}
            correlationId={correlationId}
            closeModal={closeModal}
            simswapSessionId={deviceInfo?.simswapSessionId}
            cartDetails={props?.cartDetails}
            customerProfileDetails={props?.customerProfileDetails}
            activeMtn={props?.activeMtn || getQueryParamByName('activeMtn')}
            setMitekIdVerifyStatus={props?.setMitekIdVerifyStatus}
            DeviceScanFow
            disableUpdateDeviceSwap={disableUpdate}
          />
        )}
      </div>
    )
  );
};

DeviceSimID.defaultProps = {
  careUsingExistingSimNote:
    'Please access the following path in ACSS to complete an add a line order when the customer is using an existing device and SIM/eSIM: Devices tab> Links/Action> Add line/CPE(NSO)',
  eSimOstLinkUrl: 'https://vzwkm.vzwcorp.com/docs/222206.html?userid=infomgr_search_ts&externalId=222206',
  eSimOstLinkText: 'eSIM OST click ',
  esimEligibilityText:
    'This device is eSIM capable. Before completing a SIM only order, recommend eSIM activation to the customer',
  disableDeviceSimIdText: 'There is a pending order on this line. Cannot make changes to SIM or Device',
};

export default DeviceSimID;

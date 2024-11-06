import styled from 'styled-components';
import { Button } from '@vds/buttons';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { getQueryParamByName } from 'onevzsoemfeframework/DomService';
import { getAssistedCradleProperty } from 'onevzsoemfeframework/AssistedCradleService';
import IncompatibleModal from './IncompatibleModal';

const bgColor = window?.mfe?.scmDeviceMfeEnable && window?.mfe?.acssThemeProps?.background;
const isDark = window?.mfe?.scmDeviceMfeEnable && window?.mfe?.isDark;
const FooterArea = styled.div`
  background-color: ${isDark ? bgColor : '#ffffff'};
  bottom: 0px;
  display: flex;
  flex-wrap: wrap;
  width: 252px;
  button:enabled:focus {
    color: white;
  }
`;

function Footer(props) {
  const {
    btnLabel,
    callDeviceAddToCart,
    isCartBtnEnable,
    deviceFromCart,
    isDWOS,
    disableUpdateBtn,
    removeLines,
    disableUpdateButtonSimFlow,
    isPdpUpdated,
    ispuItemInCart,
    navigateToIspu,
    isDropshipDisabled,
  } = props;
  const { isPromoEligible = true } = props;
  const [inEligibleDevice, setIinEligibleDevice] = useState(false);
  const prospectByodFlow = getQueryParamByName('prospectByodFlow');
  const prospectByodFlowcompitable = getQueryParamByName('ByodDeviceCompitable');
  const isDWOSFlow = getQueryParamByName('isDWOS') || ''; // for DWOS flow we are sending Y
  const [isDeviceCompatible] = getAssistedCradleProperty(['isDeviceCompatible']);
  const isSecondNumDfill = sessionStorage.getItem('isSecondNumDfill');
  const enableInEligibleDevice = () => {
    setIinEligibleDevice(!inEligibleDevice);
  };
  const handleAddDeviceCall = () => {
    if (deviceFromCart || (deviceFromCart && !isDWOS)) {
      callDeviceAddToCart();
    } else {
      AddDeviceCall();
    }
  };
  const handleModal = () => {
    props?.setSecondNumberWarningModal(true);
  };
  const AddDeviceCall = () => {
    if (
      (isPromoEligible === true && !(prospectByodFlow === 'false' && prospectByodFlowcompitable === 'false')) ||
      isDWOSFlow === 'Y'
    ) {
      callDeviceAddToCart();
    } else if (
      (((prospectByodFlow === null || prospectByodFlow === 'false') && isPromoEligible === false) ||
        (prospectByodFlow === 'false' && prospectByodFlowcompitable === 'false') ||
        (prospectByodFlow === 'true' && prospectByodFlowcompitable === 'false')) &&
      isDeviceCompatible === 'TRUE'
    ) {
      enableInEligibleDevice();
    } else {
      callDeviceAddToCart();
    }
  };
  return (
    <>
      <FooterArea>
        {inEligibleDevice && (
          <IncompatibleModal
            showModal={inEligibleDevice}
            setIinEligibleDevice={setIinEligibleDevice}
            onAddDeviceToCart={callDeviceAddToCart}
            activeMtn={props.activeMtn}
            onClose={enableInEligibleDevice}
          />
        )}
        {(btnLabel === 'Add to Cart' ||
          btnLabel === 'Ship It' ||
          btnLabel === 'Update' ||
          btnLabel === 'BYTD' ||
          btnLabel === 'Pick Up') &&
          !deviceFromCart &&
          !isSecondNumDfill && (
            <>
              {isDropshipDisabled && <div>This item is unavailable.</div>}
              <Button
                width='154px'
                size='large'
                inverted
                secondary
                surface={isDark ? 'dark' : 'light'}
                onClick={props?.checkSecondNumberFlag ? handleModal : handleAddDeviceCall}
                disabled={
                  !isCartBtnEnable ||
                  disableUpdateButtonSimFlow ||
                  (props?.dpEligibilityCallFailure && props?.contractType === 'DEVICE_PAYMENT') ||
                  isDropshipDisabled
                }
                data-track={btnLabel}
              >
                {btnLabel}
              </Button>
            </>
          )}
        {btnLabel === 'BYOD' && !deviceFromCart && !isSecondNumDfill && (
          <Button
            width='154px'
            size='large'
            inverted
            secondary
            disabled={!props?.enableBYODbtn || disableUpdateButtonSimFlow}
            onClick={callDeviceAddToCart}
            data-track={btnLabel}
          >
            {btnLabel}
          </Button>
        )}

        {btnLabel === 'Find Stores' && !deviceFromCart && (
          <Button size='large' disabled={!isCartBtnEnable} data-track={btnLabel}>
            {btnLabel}
          </Button>
        )}
      </FooterArea>
      {(deviceFromCart || isSecondNumDfill) && (
        <FooterArea>
          <>
            {!isSecondNumDfill && (
              <Button
                inverted
                secondary
                size='large'
                data-track='Remove'
                label='Remove'
                data-testid='remove'
                surface={isDark ? 'dark' : 'light'}
                style={{ marginRight: '10px', marginBottom: '10px', width: '154px' }}
                onClick={removeLines}
              >
                Remove
              </Button>
            )}
            {((!isDWOS && !ispuItemInCart) || isSecondNumDfill) && (
              <Button
                inverted
                secondary
                size='large'
                style={{ marginBottom: '10px', width: '154px' }}
                data-track='Update'
                disabled={disableUpdateBtn || disableUpdateButtonSimFlow}
                label='Update'
                surface={isDark ? 'dark' : 'light'}
                data-testid='update'
                onClick={handleAddDeviceCall}
              >
                Update
              </Button>
            )}
            {ispuItemInCart && !isPdpUpdated && (
              <Button
                inverted
                secondary
                size='large'
                style={{ marginBottom: '10px', width: '154px' }}
                disabled={!isCartBtnEnable}
                data-track='Find Stores'
                surface={isDark ? 'dark' : 'light'}
                onClick={navigateToIspu}
              >
                Find Stores
              </Button>
            )}
          </>
        </FooterArea>
      )}
    </>
  );
}
export default Footer;

Footer.propTypes = {
  btnLabel: PropTypes.string,
  callDeviceAddToCart: PropTypes.func,
  isCartBtnEnable: PropTypes.bool,
  activeMtn: PropTypes.any,
  isPromoEligible: PropTypes.bool,
  enableBYODbtn: PropTypes.bool,
  isPdpUpdated: PropTypes.bool,
  ispuItemInCart: PropTypes.bool,
  navigateToIspu: PropTypes.func,
  dpEligibilityCallFailure: PropTypes.bool,
};

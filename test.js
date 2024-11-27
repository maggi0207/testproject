import RemoteLoader from 'onevzsoemfeframework/RemoteLoader';
import { GetAppConfig } from 'onevzsoemfeframework/GetAppConfig';
import Emitter from 'onevzsoemfeframework/Emitter';
import { Notification } from '@vds/notifications';
import { Tabs, Tab } from '@vds/tabs';
import { memo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getQueryParamByName } from 'onevzsoemfecommon/Helpers';
import FederatedWrapper from '../../modules/errorHandling/FederatedWrapper';

function WrapperInfo11(propsVal) {
  return (
    <FederatedWrapper
      error={<Notification type='error' title='' subtitle='' fullBleed inline disableFocus />}
      delayed={<div />}
    >
      <RemoteLoader {...propsVal.propsData} />
    </FederatedWrapper>
  );
}

const DeviceGridwall = memo((props) => {
  const scmUpgradeMfeEnable = window?.mfe?.scmUpgradeMfeEnable;
  const appConfig = GetAppConfig();
  const { messages } = appConfig;
  const { mfe_down_title, mfe_down_subtitle } = messages;

  const TabContainer = styled.div`
    padding: 0 1.25rem;
    flex: 1;
    height: 100%;
    overflow: auto;
    background-color: ${({ bgColor }) => bgColor};
  `;
  const ACSSGridWallWrapper = styled.div`
    display: flex;
    height: 560px;
  `;
  const LeftWrapper = styled.div`
    width: 269px;
    background-color: #f6f6f6;
    // overflow: auto;
    box-sizing: border-box;
  `;

  const DeviceLoadRoute = {
    scope: 'onevzsoemfeassisteddevice',
    app: 'onevzsoemfeassistedhost',
    module: './PDP',
    moduleProps: {
      pageContext: 'Product-Detail',
      transformedValidateDeviceSimIdData: props?.transformedValidateDeviceSimIdData,
      moduleProps: props,
    },
  };

  const AccessoryloadRoute = {
    scope: 'onevzsoemfeassistedaccessory',
    app: 'onevzsoemfeassistedhost',
    module: './Accessory',
    moduleProps: {
      pageContext: 'Accessory',
      moduleProps: props,
    },
  };

  const AccessoryPDPloadRoute = {
    scope: 'onevzsoemfeassistedaccessory',
    app: 'onevzsoemfeassistedhost',
    module: './AccessoryPdp',
    moduleProps: {
      pageContext: 'AccessoryPdp',
      moduleProps: props,
    },
  };

  const SideBarloadRoute = {
    scope: 'onevzsoemfeassistedaccount',
    app: 'onevzsoemfeassistedhost',
    module: './LineTrail',
    moduleProps: {
      pageContext: 'Account Line Trail',
      moduleProps: props,
    },
  };

  const onTabClick = (e, idx) => {
    if (idx === 0) {
      Emitter.emit('ACSS_SCM_DEVICE_SUBTAB', true);
    }
  };
  const selectedAccessoriesSubTab = ['A', 'APDP'].includes(getQueryParamByName('defaultTab'));
  const AccessoryRouteHandler = getQueryParamByName('defaultTab') === 'APDP' ? AccessoryPDPloadRoute : AccessoryloadRoute;
  return (
    <div data-testid='flex-plans-gridwall-section'>
      <ACSSGridWallWrapper>
        <LeftWrapper data-testid='flex-left-rail-section'>
          <WrapperInfo11 propsData={SideBarloadRoute} />
        </LeftWrapper>
        <TabContainer
          bgColor={window?.mfe?.csMfeFlow && props?.acssThemeProps?.background ? props.acssThemeProps.background : ''}
        >
          {scmUpgradeMfeEnable ? <Tabs orientation='horizontal' indicatorPosition='bottom' size='large' onTabChange={onTabClick}>
            <Tab label='Devices' data-track='CombineGridwall_Devices'>
              <FederatedWrapper
                error={
                  <Notification
                    type='error'
                    title={mfe_down_title}
                    subtitle={mfe_down_subtitle}
                    fullBleed
                    inline
                    disableFocus
                  />
                }
                delayed={<div />}
              >
                <RemoteLoader {...DeviceLoadRoute} />
              </FederatedWrapper>
            </Tab>
            <Tab label='AccessorySCM' selected={selectedAccessoriesSubTab} data-track='CombineGridwall_Plans'>
              <FederatedWrapper
                error={
                  <Notification
                    type='error'
                    title={mfe_down_title}
                    subtitle={mfe_down_subtitle}
                    fullBleed
                    inline
                    disableFocus
                  />
                }
                delayed={<div />}
              >
                <RemoteLoader {...AccessoryRouteHandler} />
              </FederatedWrapper>
            </Tab>
          </Tabs> : <div data-testid='flex-review-plans-section'>
            <FederatedWrapper
              error={
                <Notification
                  type='error'
                  title={mfe_down_title}
                  subtitle={mfe_down_subtitle}
                  fullBleed
                  inline
                  disableFocus
                />
              }
              delayed={<div />}
            >
              <RemoteLoader {...DeviceLoadRoute} />
            </FederatedWrapper>
          </div>
          }
        </TabContainer>
      </ACSSGridWallWrapper>
    </div>
  );
});

DeviceGridwall.defaultProps = {
  moduleProps: {},
  acssThemeProps: {
    background: '',
  },
};
DeviceGridwall.propTypes = {
  moduleProps: PropTypes.shape({}),
  acssThemeProps: PropTypes.shape({
    background: PropTypes.string,
  }),
  transformedValidateDeviceSimIdData: PropTypes.object,
};
export default DeviceGridwall;

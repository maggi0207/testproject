import React from 'react';
import { importRemote } from '@module-federation/utilities';

function AssistedMfeHostConnector({ module, moduleProps }) {
  // Uncomment the below if you are running the Host MFE seperately and wants use that
  const remoteEntryUrl = 'http://localhost:3002';
  //const remoteEntryUrl=  window.location.origin+'/etc/clientlibs/vcg/assisted/soe-assisted-mfe/onevzsoemfeassistedhost/100';
  const MfeHostConnector = React.lazy(() =>
    importRemote({
      url: remoteEntryUrl,
      scope: 'onevzsoemfeassistedhost',
      module: 'MfeHostConnector',
      bustRemoteEntryCache: false,
    }),
  );
  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <MfeHostConnector module={module} moduleProps={moduleProps} />
    </React.Suspense>
  );
}
export default AssistedMfeHostConnector;

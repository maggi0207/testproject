import React from 'react';
import { importRemote } from '@module-federation/utilities';

// Create a memoized loader to prevent unnecessary re-fetching
const memoizedImport = (() => {
  let cachedModule = null;
  let loading = false;
  let promise = null;
  
  return () => {
    if (cachedModule) return Promise.resolve(cachedModule);
    if (loading) return promise;
    
    loading = true;
    const remoteEntryUrl = 'http://localhost:3002';
    // const remoteEntryUrl = window.location.origin+'/etc/clientlibs/vcg/assisted/soe-assisted-mfe/onevzsoemfeassistedhost/100';
    
    promise = importRemote({
      url: remoteEntryUrl,
      scope: 'onevzsoemfeassistedhost',
      module: 'MfeHostConnector',
      bustRemoteEntryCache: false,
    }).then(module => {
      cachedModule = module;
      loading = false;
      return module;
    });
    
    return promise;
  };
})();

function AssistedMfeHostConnector({ module, moduleProps }) {
  // Use React.lazy with our memoized import function
  const MfeHostConnector = React.lazy(memoizedImport);
  
  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <MfeHostConnector module={module} moduleProps={moduleProps} />
    </React.Suspense>
  );
}

export default AssistedMfeHostConnector;

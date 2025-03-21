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



import React, { useState, useEffect } from 'react';
import { importRemote } from '@module-federation/utilities';

// Move the module loading outside the component to cache it
const loadRemoteModule = () => {
  const remoteEntryUrl = 'http://localhost:3002';
  // const remoteEntryUrl = window.location.origin+'/etc/clientlibs/vcg/assisted/soe-assisted-mfe/onevzsoemfeassistedhost/100';
  
  return importRemote({
    url: remoteEntryUrl,
    scope: 'onevzsoemfeassistedhost',
    module: 'MfeHostConnector',
    bustRemoteEntryCache: false,
  });
};

// Cache the module promise
const modulePromise = loadRemoteModule();

function AssistedMfeHostConnector({ module, moduleProps }) {
  const [MfeHostConnector, setMfeHostConnector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    modulePromise
      .then((Component) => {
        if (mounted) {
          setMfeHostConnector(() => Component);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load remote module:', err);
        setLoading(false);
      });
      
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  return MfeHostConnector ? <MfeHostConnector module={module} moduleProps={moduleProps} /> : null;
}

export default AssistedMfeHostConnector;

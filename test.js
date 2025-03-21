import React, { useEffect, useRef } from 'react';
import { importRemote } from '@module-federation/utilities';

function AssistedMfeHostConnector({ module, moduleProps }) {
  // For debugging renders
  const renderCount = useRef(0);
  
  // For debugging prop changes
  const prevProps = useRef({ module, moduleProps });
  
  useEffect(() => {
    // Increment render count
    renderCount.current += 1;
    console.log(`[AssistedMfeHostConnector] Render count: ${renderCount.current}`);
    
    // Check which props changed
    const prev = prevProps.current;
    
    if (prev.module !== module) {
      console.log('[AssistedMfeHostConnector] "module" prop changed:', {
        from: prev.module,
        to: module
      });
    }
    
    if (prev.moduleProps !== moduleProps) {
      console.log('[AssistedMfeHostConnector] "moduleProps" prop changed:', {
        from: prev.moduleProps,
        to: moduleProps
      });
      
      // If moduleProps is an object, log which specific properties changed
      if (typeof moduleProps === 'object' && moduleProps !== null &&
          typeof prev.moduleProps === 'object' && prev.moduleProps !== null) {
        
        const allKeys = new Set([
          ...Object.keys(prev.moduleProps),
          ...Object.keys(moduleProps)
        ]);
        
        allKeys.forEach(key => {
          if (prev.moduleProps[key] !== moduleProps[key]) {
            console.log(`[AssistedMfeHostConnector] moduleProps.${key} changed:`, {
              from: prev.moduleProps[key],
              to: moduleProps[key]
            });
          }
        });
      }
    }
    
    // Update previous props reference
    prevProps.current = { module, moduleProps };
  });
  
  // Uncomment the below if you are running the Host MFE seperately and wants use that
  const remoteEntryUrl = 'http://localhost:3002';
  //const remoteEntryUrl=  window.location.origin+'/etc/clientlibs/vcg/assisted/soe-assisted-mfe/onevzsoemfeassistedhost/100';
  
  // Log when the lazy component is initialized
  console.log('[AssistedMfeHostConnector] Initializing lazy component');
  
  const MfeHostConnector = React.lazy(() => {
    console.log('[AssistedMfeHostConnector] Loading remote module');
    return importRemote({
      url: remoteEntryUrl,
      scope: 'onevzsoemfeassistedhost',
      module: 'MfeHostConnector',
      bustRemoteEntryCache: false,
    }).then(module => {
      console.log('[AssistedMfeHostConnector] Remote module loaded successfully');
      return module;
    }).catch(error => {
      console.error('[AssistedMfeHostConnector] Error loading remote module:', error);
      throw error;
    });
  });
  
  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <MfeHostConnector module={module} moduleProps={moduleProps} />
    </React.Suspense>
  );
}

export default AssistedMfeHostConnector;

import React, { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { WaitMessage } from '@wf-wfria/pioneer-core';

const withAuthRedirect = (WrappedComponent) => {
  return (props) => {
    const  auth  = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        if (auth.isLoading) {
          return;
        }
        if (!auth.isAuthenticated) {
          await auth.signinRedirect();
          return; 
        }
        setIsLoading(false);
      };

      checkAuth();
    }, [auth]);

    if (isLoading) {
      return <WaitMessage render={() => <>Loading...</>} type="spinner" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthRedirect;

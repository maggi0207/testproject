import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@wf-wfria/pioneer-core';
import App from './App';
import { AuthProvider } from 'react-oidc-context';
import axios from 'axios';
import { getWithCompleteURL } from './services/ServiceUtils';

// Callbacks for OIDC
const onSigninCallback = (_user) => {
  window.history.replaceState(
    {},
    document.title,
    sessionStorage.getItem("originURL")
  );
};

const onRemoveUser = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

async function setupOIDCConfig() {
  const env = await axios.get(
    window.location.origin + "/json/env-properties.json"
  );

  const url = `${env.data.ONEOPS_SERVICE_BASE_URL}/oneops/config/PING_CONFIG`;

  return getWithCompleteURL(url, { noToken: true }).then((response) => {
    const OIDCconfigvalues = response.data;

    return {
      authority: encodeURI(OIDCconfigvalues[0].currentValue?.PING_AUTHORITY),
      client_id: OIDCconfigvalues[0].currentValue?.ONEOPS_PING_CLIENT_ID,
      redirect_uri: encodeURI(
        OIDCconfigvalues[0].currentValue?.PING_REDIRECT_URI_PATH
      ),
      scope: OIDCconfigvalues[0].currentValue?.PING_SCOPE,
      response_type: "code",
      revokeTokenAdditionalContentTypes: "text/html;charset=utf-8",
      automaticSilentRenew: true,
      onSigninCallback,
      onRemoveUser,
      metadataSeed: {
        end_session_endpoint: encodeURI(
          `${OIDCconfigvalues[0].currentValue?.PING_AUTHORITY}idp/startSLO.ping`
        ),
      },
    };
  });
}

async function mount(el) {
  const oidcConfig = await setupOIDCConfig();

  if (window.location.href.indexOf("code") === -1) {
    sessionStorage.setItem("originURL", window.location.href);
  }

  const appTemplate = (
    <ThemeProvider baseTheme="graphite">
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </ThemeProvider>
  );

  ReactDOM.createRoot(el).render(appTemplate);
}

// This should point to the correct DOM element where you want to mount your app
const mfeRootElement = document.getElementById('app');
mount(mfeRootElement);

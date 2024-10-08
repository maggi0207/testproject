import React, { useEffect, useCallback, Suspense } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Feedback, IconError, Masthead, Tab, Tabs, WaitMessage } from '@wf-wfria/pioneer-core';
import './style/App.css';
import 'navigator.sendbeacon';
import STPTranscationsChart from './components/STPTranscationsChart/STPTranscationsChart';
import TransactionsChart from './components/TransactionsChart/TransactionsChart';
import RuleMigrationChart from './components/RuleMigrationChart/RuleMigrationChart';
import RuleUtilizationChart from './components/RuleUtilizationChart/RuleUtilizationChart';
import FedOutboundComparisonChart from './components/FedOutboundComparisonChart/FedOutboundComparisonChart';
import { fetchComparisonReportSuccess, handleInterRunAPIError, setReportLoadingInProgress } from './redux/actions/AppActions';
import ErrorBoundary from './common/ErrorBoundary';
import AVStatsChart from './components/avStatsChart';
import { fetchComparisonReportData } from './services/ajax.service';
import { useAuth } from 'react-oidc-context';
import { ENABLE_LOGIN } from './common/utils/OIDCConfigConstants';

const App = (props) => {
  const dispatch = useDispatch();
  const { reportData, isReportLoading, isAPIError } = useSelector((state) => state.AppReducer);
  const auth = useAuth();

  // Loading state
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Start the authentication flow if the user is not authenticated
    if (ENABLE_LOGIN && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    } else if (auth.isAuthenticated) {
      // If authenticated, set loading to false
      setIsLoading(false);
    }
  }, [auth]);

  // Fetch report data only when authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchReportData();
    }
  }, [auth.isAuthenticated]);

  const fetchReportData = async () => {
    dispatch(setReportLoadingInProgress());
    try {
      const response = await fetchComparisonReportData();
      if (response?.status === 200) {
        dispatch(fetchComparisonReportSuccess(response?.data));
      } else {
        dispatch(handleInterRunAPIError([]));
      }
    } catch (err) {
      dispatch(handleInterRunAPIError(err?.response?.data));
    }
  };

  // Show loading message while checking authentication
  if (isLoading) {
    return <WaitMessage render={() => <> Loading... </>} type="spinner" />;
  }

  return (
    <ErrorBoundary>
      <Masthead />
      {isReportLoading && (
        <WaitMessage render={() => <> Loading... </>} type="spinner" />
      )}
      {isAPIError ? (
        <Feedback
          icon={<IconError size="large" />}
          size="medium"
          padding
          border
          theme="informational"
        >
          {"Error while connecting to Back-End server. Server might be down. Please try again after some time"}
        </Feedback>
      ) : (
        <Tabs defaultSelectedTab={0}>
          <Tab title="Transactions by Phase">
            <Suspense fallback={<WaitMessage render={() => <> Loading... </>} type="spinner" />}>
              <TransactionsChart reportData={reportData} />
            </Suspense>
          </Tab>
          <Tab lazyLoad title="AV Transactions">
            <Suspense fallback={<WaitMessage render={() => <> Loading... </>} type="spinner" />}>
              <AVStatsChart reportData={reportData} />
            </Suspense>
          </Tab>
          <Tab lazyLoad title="STP Transactions">
            <Suspense fallback={<WaitMessage render={() => <> Loading... </>} type="spinner" />}>
              <STPTranscationsChart reportData={reportData} />
            </Suspense>
          </Tab>
          <Tab lazyLoad title="Rule Migration">
            <Suspense fallback={<WaitMessage render={() => <> Loading... </>} type="spinner" />}>
              <RuleMigrationChart reportData={reportData} />
            </Suspense>
          </Tab>
          <Tab lazyLoad title="Rule Utilization">
            <Suspense fallback={<WaitMessage render={() => <> Loading... </>} type="spinner" />}>
              <RuleUtilizationChart reportData={reportData} />
            </Suspense>
          </Tab>
          <Tab lazyLoad title="Fedwire Outbound Comparison">
            <Suspense fallback={<WaitMessage render={() => <> Loading... </>} type="spinner" />}>
              <FedOutboundComparisonChart reportData={reportData} />
            </Suspense>
          </Tab>
        </Tabs>
      )}
    </ErrorBoundary>
  );
};

App.propTypes = {
  reportData: PropTypes.object,
  isReportLoading: PropTypes.bool,
  isAPIError: PropTypes.bool
};

export default App;

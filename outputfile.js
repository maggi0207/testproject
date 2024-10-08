import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, WaitMessage, Feedback, Tabs, Tab } from '@wf-wfria/pioneer-core';
import { IconError } from '@wf-wfria/pioneer-icons';
import ErrorBoundary from './ErrorBoundary';
import Masthead from './Masthead';
import TransactionsChart from './TransactionsChart';
import AVStatsChart from './AVStatsChart';
import STPTranscationsChart from './STPTranscationsChart';
import RuleMigrationChart from './RuleMigrationChart';
import RuleUtilizationChart from './RuleUtilizationChart';
import FedOutboundComparisonChart from './FedOutboundComparisonChart';
import { fetchComparisonReportData, handleInterRunAPIError } from '../actions/reportActions';
import { setReportLoadingInProgress, fetchComparisonReportSuccess } from '../reducers/reportReducer';
import { useAuth } from '../hooks/useAuth';

const App = () => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const reportData = useSelector((state) => state.report.data);
  const isReportLoading = useSelector((state) => state.report.isLoading);
  const isAPIError = useSelector((state) => state.report.isAPIError);

  useEffect(() => {
    // Check if the user is authenticated; if not, redirect to login
    if (ENABLE_LOGIN && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    } else {
      setIsLoading(false); // Stop loading once the auth check is complete
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  const handleLogOff = () => {
    auth.signoutRedirect(); // Trigger the logout process
  };

  const onBeforeUnload = useCallback((e) => {
    e.preventDefault();
    e.returnValue = '';
    return 'Do you want to close the current tab?'; // for IE
  }, []);

  const onUnload = useCallback(() => {
    props.onExit();
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('unload', onUnload);
    fetchReportData();

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('unload', onUnload);
    };
  }, []);

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

  if (isLoading) {
    return <WaitMessage render={() => <>Loading...</>} type="spinner" />; // Loading indicator
  }

  return (
    <ErrorBoundary>
      <div style={{ position: 'relative' }}>
        <Masthead />
        <Button
          style={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={handleLogOff}
        >
          Log Off
        </Button>
        {isReportLoading && (
          <WaitMessage
            render={() => <> Loading... </>}
            type="spinner"
          />
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
      </div>
    </ErrorBoundary>
  );
};

App.propTypes = {
  reportData: PropTypes.object,
  isReportLoading: PropTypes.bool,
  isAPIError: PropTypes.bool
};

export default App;

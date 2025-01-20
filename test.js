import { MapTo } from '@adobe/aem-react-editable-components';
import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../ToggleSwitch';
import getDistributionListMembers from '../../../../Services/getDistributionListMembers';
import getDistributionListNames from '../../../../Services/getDistributionListNames';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetValues,
    setCommunicationPreferencesInitialValues,
    setCurrentPreferencesInitialValues,
    updateCommunicationPreferenceToggle
} from '../../../../store/CommunicationNotification/EmailPreferenceSlice';
import updateEmailDeliveryPreferences from '../../../../Services/updateEmailDeliveryPreferences';
import { loadingIndicatorActions } from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';
import { getPreferenceFromBooleans } from '../../../../utils/communicationNotificationUtils';
import updateDistributionListMembers from '../../../../Services/updateDistributionListMembers';
import ReactTooltip from 'react-tooltip';
import { dataLayerAccountNotifications } from "../../../../utils/analyticsUtils";
import ToastNotification from '../ToastNotification';
import {
    EMAIL_PREFERENCES_SUCCESS_MSG,
    EMAIL_PREFERENCES_FAILURE_MSG,
    COMMUNICATION_PREFERENCES_FAILURE_MSG,
    COMMUNICATION_PREFERENCES_SUCCESS_MSG,
    EMAIL_PREFERENCES_CANCEL_MSG, COMMUNICATION_PREFERENCES_CANCEL_MSG
} from "../../../../utils/constants";

const CommunicationMessageNotificationsConfig = {
    emptyLabel: 'CCH Communication Message Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};

const CommunicationDistributionListMembers = (props) => {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '', fromApi: '' });
    const [secondAlert, setSecondAlert] = useState({ open: false, severity: 'success', message: '', fromApi: '' });
    const [userNotInDL, setUserNotInDL] = useState(false);
    const [distributionListNames, setDistributionListNames] = useState([]);

    const currentEmailPreference = useSelector((state) => state.emailPreferenceSlice.emailPreferences.current);
    const communicationPreferences = useSelector((state) => state.emailPreferenceSlice.communicationPreferences.current);
    const isEmailPreferencesModified = useSelector((state) => state.emailPreferenceSlice.isEmailPreferencesModified);
    const isCommicationPreferencesModified = useSelector((state) => state.emailPreferenceSlice.isCommicationPreferencesModified);

    const isModified = useSelector((state) => state.emailPreferenceSlice.isModified);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));
        getDistributionListMembers()
            .then((response) => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                if (response.records && response.records.length > 0) {
                    const deliveryMethod = response.records[0].Delivery_Method__c;
                    updateToggleStatus(deliveryMethod);
                } else if( response.records && response.records.length === 0) {
                    setUserNotInDL(true);
                } else {
                    console.log('No records found:', response);
                    updateToggleStatus(null);
                }
            })
            .catch((error) => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                console.error('Error fetching distribution list members:', error);
            });
    }, [dispatch]);

    useEffect(() => {
        console.log("getDistributionListNames-------", getDistributionListNames)
        getDistributionListNames()
            .then((response) => {
                if (response.records && response.records.length > 0) {
                    setDistributionListNames(response.records);
                } else {
                    console.log('No records found:', response);
                }
            })
            .catch((error) => {
                console.error('Error fetching distribution list names:', error);
            });
    }, []);

    const updateToggleStatus = (deliveryMethod) => {
        switch (deliveryMethod) {
            case "Email":
            case "Email;ECC Hub Notification":
                dispatch(setCommunicationPreferencesInitialValues({ emailNotifications: true }));
                break;
            default:
                dispatch(setCommunicationPreferencesInitialValues({ emailNotifications: false }));
                break;
        }
    };

    const handleDLUpdateResponse = (response, successMessage, errorMessage, fromApi) => {
        if (response.compositeResponse[0].body.errorCode || (Array.isArray(response.compositeResponse[0].body) && response.compositeResponse[0].body[0].errorCode)) {
            console.error('Error updating distribution list:', response.compositeResponse[0].body.errorCode || (Array.isArray(response.compositeResponse[0].body) && response.compositeResponse[0].body[0].errorCode));
            if( fromApi === 'updateEmailDelivery'){
                setAlert({
                    open: true,
                    severity: 'error',
                    message: errorMessage,
                    fromApi: fromApi
                });
            } else {
                setSecondAlert({
                    open: true,
                    severity: 'error',
                    message: errorMessage,
                    fromApi: fromApi
                });
            }
        } else {
            dispatch(setCurrentPreferencesInitialValues());
            userNotInDL && fromApi === 'addUserToDL' && setUserNotInDL(false);
            if( fromApi === 'updateEmailDelivery'){
                setAlert({
                    open: true,
                    severity: 'success',
                    message: successMessage,
                    fromApi: fromApi
                });
            } else {
                setSecondAlert({
                    open: true,
                    severity: 'success',
                    message: successMessage,
                    fromApi: fromApi
                });
            }
        }
    };

  const showFailureAlert = () => {
    if (isEmailPreferencesModified) {
        setAlert({
            open: true,
            severity: 'failure',
            message: EMAIL_PREFERENCES_CANCEL_MSG,
            fromApi: 'updateEmailDelivery'
        });
    }

    if (isCommicationPreferencesModified) {
        setSecondAlert({
            open: true,
            severity: 'failure',
            message: COMMUNICATION_PREFERENCES_CANCEL_MSG,
            fromApi: 'updateDL'
        });
    }
};

    const submitButtonHandler = async () => {
        let currentPreference;
        isEmailPreferencesModified && (currentPreference = getPreferenceFromBooleans(currentEmailPreference.dailySummary, currentEmailPreference.instantNotification, currentEmailPreference.pendingActionNotification));
        const deliveryMethod = communicationPreferences?.emailNotifications ? "Email" : "";
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        try {
            if(isEmailPreferencesModified){
                await updateEmailDeliveryPreferences(currentPreference).then((result) => {
                    handleDLUpdateResponse(result, EMAIL_PREFERENCES_SUCCESS_MSG, EMAIL_PREFERENCES_FAILURE_MSG, 'updateEmailDelivery');
                });
            }
        } catch (error) {
            console.error('Error updating email preferences:', error);
            setAlert({
                open: true,
                severity: 'error',
                message: EMAIL_PREFERENCES_FAILURE_MSG,
                fromApi: 'updateEmailDelivery',
            });
        }

        try {
            if (isCommicationPreferencesModified) {
                if (userNotInDL && deliveryMethod === "Email") {
                    await updateDistributionListMembers().then((result) => {
                        handleDLUpdateResponse(result, COMMUNICATION_PREFERENCES_SUCCESS_MSG, COMMUNICATION_PREFERENCES_FAILURE_MSG, 'addUserToDL');
                    });
                } else if (!userNotInDL) {
                    await updateDistributionListMembers(deliveryMethod).then((result) => {
                        handleDLUpdateResponse(result, COMMUNICATION_PREFERENCES_SUCCESS_MSG, COMMUNICATION_PREFERENCES_FAILURE_MSG, 'updateDL');
                    });
                }
            }
        } catch (error) {
            console.error('Error updating communication preferences:', error);
            setSecondAlert({
                open: true,
                severity: 'error',
                message: COMMUNICATION_PREFERENCES_FAILURE_MSG,
                fromApi: 'updateDL',
            });
        } finally {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
        }
        dataLayerAccountNotifications("communication update");
    };

    const cancelButtonHandler = () => {
        dispatch(resetValues());
        showFailureAlert();
        dataLayerAccountNotifications("communication cancel");
    };

    const handleToggleChange = () => {
        dispatch((updateCommunicationPreferenceToggle({emailNotifications: !communicationPreferences?.emailNotifications})));
        dataLayerAccountNotifications(communicationPreferences?.emailNotifications ? "message type email notification off" : "message type email notification on");
    }

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const handleCloseSecondAlert = () => {
        setSecondAlert({ ...alert, open: false });
    };

    return (
        <>
                <div className="communication-preferences-container">
                    <div className="communication-preferences-paper">
                        <h4 className="notification__title">{props?.titlePreferences}</h4>
                        <p className="notification__desc">{props?.descriptionPreferences}</p>
                        {distributionListNames.map((listName, index) => (
                            <div key={index} style={{
                                borderBottom: index !== distributionListNames.length - 1 ? '1px solid #dee4ec' : 'none',
                                paddingBottom: index !== distributionListNames.length - 1 ? '24px' : '0'
                            }}>
                                <div className="preference-row">
                                    <div className="toggle-group">
                                        <div className="preference-label">
                                            <strong>Message Type</strong>
                                            <div style={{ width : '250px'}}>{listName.Name}</div>
                                        </div>
                                        <div className="preference-label">
                                            <div>
                                            <span>
                                                <i
                                                    data-tip
                                                    data-for={`preference-${index}`}
                                                ></i>
                                            </span>
                                                <ReactTooltip
                                                    id={`preference-${index}`}
                                                    place="top"
                                                    backgroundColor="#001D5B"
                                                    arrowColor="#001D5B"
                                                    textColor="#fff"
                                                    borderColor="001D5B"
                                                    multiline={true}
                                                    className="opt_tooltip"
                                                >
                                                    {props?.preferenceToolTip}
                                                </ReactTooltip>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="toggle-group">
                                        <div className="email-notification">{props?.preferenceEmail}</div>
                                        <div className="toggle-control">
                                            <span>Off</span>
                                            <ToggleSwitch
                                                checked={communicationPreferences?.emailNotifications || false}
                                                onChange={handleToggleChange}
                                                color="primary"
                                            />
                                            <span>On</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            <div className="notification-update-button-container">
                <div className="button-row">
                    <button
                        className="btn-primary"
                        disabled={!isModified}
                        type="button"
                        onClick={() => submitButtonHandler()}
                    >
                        {props?.submitBtnLabel}
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={!isModified}
                        type="button"
                        onClick={() => cancelButtonHandler()}
                    >
                        {props?.cancelBtnLabel}
                    </button>
                </div>
            </div>
            <ToastNotification
                open={alert.open}
                handleClose={handleCloseAlert}
                message={alert.message}
                type={alert.severity}
                fromApi={alert.fromApi}
            />
            <ToastNotification
                open={secondAlert.open}
                handleClose={handleCloseSecondAlert}
                message={secondAlert.message}
                type={secondAlert.severity}
                fromApi={secondAlert.fromApi}
            />
        </>
    );
};

export default MapTo('ECCHub/components/nextgen/communicationmessagenotifications')(
    CommunicationDistributionListMembers,
    CommunicationMessageNotificationsConfig
);

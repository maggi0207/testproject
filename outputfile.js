import { MapTo } from '@adobe/aem-react-editable-components';
import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../ToggleSwitch';
import getDistributionListMembers from '../../../../Services/getDistributionListMembers';
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
import {dataLayerAccountNotifications}  from "../../../../utils/analyticsUtils";
import ToastNotification from '../ToastNotification'; // Import ToastNotification component
import addDistributionListMember from '../../../../Services/addDistributionListMember';
import { API_ERROR_MODAL_TITLE } from '../../../../utils/constants';

const CommunicationMessageNotificationsConfig = {
    emptyLabel: 'CCH Communication Message Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};

const CommunicationDistributionListMembers = (props) => {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '', heading: '', fromApi: '' });
    const [secondAlert, setSecondAlert] = useState({ open: false, severity: 'success', message: '', heading: '', fromApi: '' });
    const [userNotInDL, setUserNotInDL] = useState(false);

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

    const updateToggleStatus = (deliveryMethod) => {
        switch (deliveryMethod) {
            case "Email":
                dispatch(setCommunicationPreferencesInitialValues({emailNotifications: true}));
                break;
            case "Email;ECC Hub Notification":
                dispatch(setCommunicationPreferencesInitialValues({emailNotifications: true}));
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
                    heading: 'Update Failed',
                    fromApi: fromApi
                });
            } else {
                setSecondAlert({
                    open: true,
                    severity: 'error',
                    message: errorMessage,
                    heading: 'Update Failed',
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
                    heading: 'Update changes to submit',
                    fromApi: fromApi
                });
            } else {
                setSecondAlert({
                    open: true,
                    severity: 'success',
                    message: successMessage,
                    heading: 'Update changes to submit',
                    fromApi: fromApi
                });
            }
        }
    };

    const submitButtonHandler = async () => {
        let currentPreference;
        isEmailPreferencesModified && (currentPreference = getPreferenceFromBooleans(currentEmailPreference.dailySummary, currentEmailPreference.instantNotification, currentEmailPreference.pendingActionNotification));
        const deliveryMethod = communicationPreferences?.emailNotifications ? "Email" : "";
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        try {
            if(isEmailPreferencesModified){
                updateEmailDeliveryPreferences(currentPreference).then((result) => {
                    handleDLUpdateResponse(result, 'Your case email notifications preferences have been updated.', 'Your case email notifications preferences could not be updated.', 'updateEmailDelivery');
                });
            }
            if(isCommicationPreferencesModified){
                if(userNotInDL && deliveryMethod === "Email") {
                    addDistributionListMember().then((result) => {
                        handleDLUpdateResponse(result, 'Your communication message notifications preferences have been updated.', 'Your communication message notifications preferences could not be updated.', 'addUserToDL');
                    });
                } else if(!userNotInDL){
                    updateDistributionListMembers(deliveryMethod).then((result) => {            
                        handleDLUpdateResponse(result, 'Your communication message notifications preferences have been updated.', 'Your communication message notifications preferences could not be updated.', 'updateDL');
                    });
                }
            }
        } catch (error) {
                console.error('Error updating preferences:', error);
                setAlert({
                    open: true,
                    severity: 'error',
                    message: 'Your preferences could not be updated.',
                    heading: API_ERROR_MODAL_TITLE,
                });
        } finally {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
        }
        dataLayerAccountNotifications("communication update");
    };

    const cancelButtonHandler = () => {
        dispatch(resetValues());
        setAlert({
            open: true,
            severity: 'error',
            message: 'Your preferences were not saved. If you wish to make changes, please update your preferences again.',
            heading: 'Cancel changes to reset',
        });
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
            {props?.preferenceName && props?.preferenceToolTip && props?.preferenceEmail ? (
                <div className="communication-preferences-container">
                    <div className="communication-preferences-paper">
                        <h4 className="notification__title">{props?.titlePreferences}</h4>
                        <p className="notification__desc">{props?.descriptionPreferences}</p>
                        <div className="preference-row">
                            <div className="toggle-group">
                                <div className="preference-label">
                                    <strong>{props?.preferenceText}</strong>
                                </div>
                                <div className="preference-label">
                                    <div>
                                        {props?.preferenceName}
                                        <span>
                                            <i
                                                data-tip
                                                data-for="preference"
                                                className="iconCircleInfo"
                                            ></i>
                                        </span>
                                        <ReactTooltip
                                            id="preference"
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
                </div>
            ) : (
                <></>
            )}
            <div className='notification-update-button-container'>
                <div className='button-row'>
                    <button className="btn-primary" disabled={!isModified} type="button"
                            onClick={() => submitButtonHandler()}>{props?.submitBtnLabel}</button>
                    <button className="btn-secondary" disabled={!isModified} type="button"
                            onClick={() => cancelButtonHandler()}>{props?.cancelBtnLabel}</button>
                </div>
            </div>

            <ToastNotification
                open={alert.open}
                handleClose={handleCloseAlert}
                message={alert.message}
                type={alert.severity}
                heading={alert.heading}
                fromApi={alert.fromApi}
            />
            <ToastNotification
                open={secondAlert.open}
                handleClose={handleCloseSecondAlert}
                message={secondAlert.message}
                type={secondAlert.severity}
                heading={secondAlert.heading}
                fromApi={secondAlert.fromApi}
            />
        </>
    );
};

export default MapTo('ECCHub/components/nextgen/communicationmessagenotifications')(
    CommunicationDistributionListMembers,
    CommunicationMessageNotificationsConfig
);

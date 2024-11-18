import { MapTo } from '@adobe/aem-react-editable-components';
import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../Togglewitch';
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
import ToastNotification from './ToastNotification'; // Import ToastNotification component

const CommunicationMessageNotificationsConfig = {
    emptyLabel: 'CCH Communication Message Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};

const CommunicationDistributionListMembers = (props) => {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '', heading: '' });

    const currentEmailPreference = useSelector((state) => state.emailPreferenceSlice.emailPreferences.current);
    const communicationPreferences = useSelector((state) => state.emailPreferenceSlice.communicationPreferences.current);

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
            case 'Email':
            case 'Email;ECC Hub Notification':
                dispatch(setCommunicationPreferencesInitialValues({ emailNotifications: true }));
                break;
            default:
                dispatch(setCommunicationPreferencesInitialValues({ emailNotifications: false }));
                break;
        }
    };

    const submitButtonHandler = async () => {
        const currentPreference = getPreferenceFromBooleans(
            currentEmailPreference.dailySummary,
            currentEmailPreference.instantNotification,
            currentEmailPreference.pendingActionNotification
        );
        const deliveryMethod = communicationPreferences?.emailNotifications ? 'Email' : 'None';
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));

        try {
            await updateEmailDeliveryPreferences(currentPreference);
            await updateDistributionListMembers(deliveryMethod);
            dispatch(setCurrentPreferencesInitialValues());
            setAlert({
                open: true,
                severity: 'success',
                message: 'Your preferences have been successfully updated.',
                heading: 'Preferences Updated',
            });
        } catch (error) {
            console.error('Error occurred:', error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Failed to update preferences. Please try again.',
                heading: 'Update Failed',
            });
        } finally {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
        }
    };

    const cancelButtonHandler = () => {
        dispatch(resetValues());
        setAlert({
            open: true,
            severity: 'error',
            message: 'Preferences reset. No changes were saved.',
            heading: 'Preferences Reset',
        });
    };

    const handleToggleChange = () => {
        dispatch(updateCommunicationPreferenceToggle({ emailNotifications: !communicationPreferences?.emailNotifications }));
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <>
            {props?.preferenceEmail && props?.preferenceToolTip ? (
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
                                        <spn>
                                            <i
                                                data-tip
                                                data-for="preference"
                                                className="iconCircleInfo"
                                            ></i>
                                        </spn>
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
            <div className="notification-update-button-container">
                <div className="button-row">
                    <button
                        className="btn-primary"
                        disabled={!isModified}
                        type="button"
                        onClick={() => submitButtonHandler()}
                    >
                        Submit
                    </button>
                    <button
                        className="btn-secondary"
                        disabled={!isModified}
                        type="button"
                        onClick={() => cancelButtonHandler()}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* ToastNotification for Alert */}
            <ToastNotification
                open={alert.open}
                handleClose={handleCloseAlert}
                message={alert.message}
                type={alert.severity}
                heading={alert.heading}
            />
        </>
    );
};

export default MapTo('ECCHub/components/nextgen/communicationmessagenotifications')(
    CommunicationDistributionListMembers,
    CommunicationMessageNotificationsConfig
);

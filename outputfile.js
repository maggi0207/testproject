import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert'; // For MUI v4.7
import {ToggleSwitch} from '../Togglewitch';
import getDistributionListMembers from '../../../../Services/getDistributionListMembers';
import {
    resetValues,
    setCommunicationPreferencesInitialValues,
    setCurrentPreferencesInitialValues,
    updateCommunicationPreferenceToggle
} from '../../../../store/CommunicationNotification/EmailPreferenceSlice';
import updateEmailDeliveryPreferences from '../../../../Services/updateEmailDeliveryPreferences';
import {loadingIndicatorActions} from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';
import {getPreferenceFromBooleans} from "../../../../utils/communicationNotificationUtils";
import updateDistributionListMembers from "../../../../Services/updateDistributionListMembers";
import ReactTooltip from 'react-tooltip';

// Alert wrapper for Snackbar
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CommunicationDistributionListMembers = (props) => {
    const [toast, setToast] = useState({open: false, message: '', severity: 'success'}); // Toast state

    const currentEmailPreference = useSelector((state) => state.emailPreferenceSlice.emailPreferences.current);
    const communicationPreferences = useSelector((state) => state.emailPreferenceSlice.communicationPreferences.current);
    const isModified = useSelector((state) => state.emailPreferenceSlice.isModified);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        getDistributionListMembers().then(response => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
            if (response.records && response.records.length > 0) {
                const deliveryMethod = response.records[0].Delivery_Method__c;
                updateToggleStatus(deliveryMethod);
            } else {
                console.log('No records found:', response);
                updateToggleStatus(null);
            }
        }).catch(error => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
            console.error('Error fetching distribution list members:', error);
        });
    }, [dispatch]);

    const updateToggleStatus = (deliveryMethod) => {
        switch (deliveryMethod) {
            case "Email":
            case "Email;ECC Hub Notification":
                dispatch(setCommunicationPreferencesInitialValues({emailNotifications: true}));
                break;
            default:
                dispatch(setCommunicationPreferencesInitialValues({emailNotifications: false}));
                break;
        }
    };

    const submitButtonHandler = async () => {
        const currentPreference = getPreferenceFromBooleans(currentEmailPreference.dailySummary, currentEmailPreference.instantNotification, currentEmailPreference.pendingActionNotification);
        const deliveryMethod = communicationPreferences?.emailNotifications ? "Email" : "None";
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));

        try {
            await updateEmailDeliveryPreferences(currentPreference);
            await updateDistributionListMembers(deliveryMethod);
            dispatch(setCurrentPreferencesInitialValues());
            setToast({open: true, message: 'Preferences updated successfully!', severity: 'success'}); // Success toast
        } catch (error) {
            console.error("Error occurred:", error);
            setToast({open: true, message: 'Failed to update preferences.', severity: 'error'}); // Failure toast
        } finally {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
        }
    };

    const cancelButtonHandler = () => {
        dispatch(resetValues());
        setToast({open: true, message: 'Preferences reset successfully.', severity: 'warning'}); // Warning toast
    };

    const handleToggleChange = () => {
        dispatch(updateCommunicationPreferenceToggle({emailNotifications: !communicationPreferences?.emailNotifications}));
    };

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToast({...toast, open: false});
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
                                <div className="preference-label"><strong>{props?.preferenceText}</strong></div>
                                <div className="preference-label">
                                    <div>
                                        {props?.preferenceName}
                                        <span>
                                            <i data-tip data-for="preference" className="iconCircleInfo"></i>
                                        </span>
                                        <ReactTooltip id="preference" place="top" backgroundColor="#001D5B"
                                                      arrowColor="#001D5B" textColor="#fff" borderColor="001D5B"
                                                      multiline={true} className="opt_tooltip">
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
            ) : <></>}
            <div className="notification-update-button-container">
                <div className="button-row">
                    <button className="btn-primary" disabled={!isModified} type="button" onClick={submitButtonHandler}>
                        Submit
                    </button>
                    <button className="btn-secondary" disabled={!isModified} type="button" onClick={cancelButtonHandler}>
                        Cancel
                    </button>
                </div>
            </div>
            {/* Snackbar for toast notifications */}
            <Snackbar open={toast.open} autoHideDuration={6000} onClose={handleCloseToast}>
                <Alert onClose={handleCloseToast} severity={toast.severity}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CommunicationDistributionListMembers;

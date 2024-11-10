import { MapTo } from '@adobe/aem-react-editable-components';
import { Switch, Tooltip, Typography } from '@material-ui/core';
import '../../../../design/components/_communicationMessageNotifications.scss';

import { useEffect, useState } from 'react';
import { ToggleSwitch } from '../Togglewitch';
import getDistributionListMembers from '../../../../Services/getDistributionListMembers';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationReset, setNotificationRest, setNotificationUpdated, updateEmailPreference } from '../../../../store/CommunicationNotification/EmailPreferenceSlice';
import updateEmailDeliveryPreferences from '../../../../Services/updateEmailDeliveryPreferences';
import { loadingIndicatorActions } from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';

const CommunicationMessageNotificationsConfig = {
    emptyLabel: 'CCH Communication Message Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};


const CommunicationDistributionListMembers = (props) => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [webNotifications, setWebNotifications] = useState(true);
    const emailPreference = useSelector((state) => state.emailPreferenceSlice.emailPreference);
    const isNotificationReset = useSelector((state) => state.emailPreferenceSlice.isNotificationReset);
    const isNotificationUpdated = useSelector((state) => state.emailPreferenceSlice.isNotificationUpdated);


    const dispatch = useDispatch();

    useEffect(() => {
        getDistributionListMembers().then(response => {
            const deliveryMethod = response.records[0].Delivery_Method__c;
            switch (deliveryMethod) {
                case "Email":
                    setEmailNotifications(true);
                    break;
                case "Email;ECC Hub Notification":
                    setEmailNotifications(true);
                    break;
                default:
                    setEmailNotifications(false);
                    break;
            }
        });
    }, []);

    const submitButtonHandler = () => {

        console.log("emailPreference", emailPreference);
        const payload = {
            "cedp": emailPreference
        }

        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));

        updateEmailDeliveryPreferences(payload)
            .then(response => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                dispatch(setNotificationUpdated(false));


                // Handle the response if needed
                console.log("Response received:", response);
            })
            .catch(error => {
                // Handle the error if needed
                console.error("Error occurred:", error);
            });
    }

    const cancelButtonHandler = () => {
        dispatch(setNotificationUpdated(false));
        dispatch(setNotificationReset(true));
    }

    return (
        <>
            <div className="communication-preferences-container">
                <div className="communication-preferences-paper">
                    <Typography className='title' variant="h6" gutterBottom>
                        Communication notification preferences
                    </Typography>
                    <Typography variant="body2" color="textSecondary" paragraph>
                        Select Communication message notifications preferences below.
                    </Typography>

                    <div className="preference-row">
                        <div className="preference-label">
                            <Typography variant="body2">
                                Payer processing issues
                                <Tooltip title="Notifications related to payer processing issues" arrow>
                                    <i data-tip data-for="preference" className="iconCircleInfo" />
                                </Tooltip>
                            </Typography>
                        </div>
                        <div className="toggle-group">
                            <Typography variant="body2">Email notifications</Typography>
                            <div className="toggle-control">
                                <span>Off</span>
                                <ToggleSwitch
                                    checked={emailNotifications}
                                    onChange={() => setEmailNotifications(!emailNotifications)}
                                    color="primary"
                                />
                                <span>On</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='notification-update-button-container'>
                <div className='button-row'>
                    <button className="btn-primary" disabled={isNotificationReset || !isNotificationUpdated} type="button" onClick={() => submitButtonHandler()}>Update</button>

                    <button className="btn-secondary" disabled={isNotificationReset || !isNotificationUpdated} type="button" onClick={() => cancelButtonHandler()}>Cancel</button>
                </div>

            </div>
        </>

    );


}


export default MapTo('ECCHub/components/nextgen/communicationmessagenotifications')(CommunicationDistributionListMembers, CommunicationMessageNotificationsConfig);

import { MapTo } from '@adobe/aem-react-editable-components';
import React, { useEffect, useState } from 'react';
import '../../../../design/components/_caseEmailNotification.scss';
import { Checkbox, Switch, Typography } from '@material-ui/core';
import { ToggleSwitch } from '../Togglewitch';
import getEmailDeliveryPreferences from '../../../../Services/getEmailDeliveryPreferences';
import { setNotificationUpdated, updateEmailPreference } from '../../../../store/CommunicationNotification/EmailPreferenceSlice';
import { useDispatch, useSelector } from 'react-redux';
import { loadingIndicatorActions } from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';


const NextGenNotificationConfig = {
    emptyLabel: 'CCH Case Email Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};

const EmailDeliveryPreferences = (props) => {
    const [dailySummary, setDailySummary] = useState(true);
    const [instantNotification, setInstantNotification] = useState(false);
    const [pendingActionNotification, setPendingActionNotification] = useState(true);
    const [isPreferenceChanged, setIsPreferenceChanged] = useState(false);
    const [currentEmailPreference, setCurrentEmailPreference] = useState(false);
    const isNotificationReset = useSelector((state) => state.emailPreferenceSlice.isNotificationReset);
    const isNotificationUpdated = useSelector((state) => state.emailPreferenceSlice.isNotificationUpdated);



    const dispatch = useDispatch();

    useEffect(() => {
        if (isNotificationReset && currentEmailPreference) {
            updateToggleStatus(currentEmailPreference);
        }

    }, [isNotificationReset]);

    useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));
        getEmailDeliveryPreferences().then(response => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
            const preference = response.records[0].Case_Email_Delivery_Preference__c;
            setCurrentEmailPreference(preference);
            updateToggleStatus(preference);
        });

    }, []);

    const updateToggleStatus = (preference) => {
        switch (preference) {
            case null:
            case "Normal":
                setDailySummary(false);
                setInstantNotification(true);
                setPendingActionNotification(false);
                break;
            case "Digest Only":
                setDailySummary(true);
                setInstantNotification(false);
                setPendingActionNotification(false);
                break;
            case "Digest and Pending":
                setDailySummary(true);
                setInstantNotification(false);
                setPendingActionNotification(true);
                break;
            default:
                setDailySummary(false);
                setInstantNotification(true);
                setPendingActionNotification(false);
                break;
        }
    }

    useEffect(() => {
        if (isPreferenceChanged) {
            updatePreference();
        }
    }, [isPreferenceChanged, pendingActionNotification])

    const updatePreference = () => {
        let preference;
        if (dailySummary && !instantNotification) {
            preference = pendingActionNotification ? "Digest and Pending" : "Digest Only";
        } else if (!dailySummary && instantNotification) {
            preference = "Normal";
        } else {
            preference = null;
        }
        console.log("chec pref", dailySummary, instantNotification, preference)

        if (preference !== currentEmailPreference) {
            dispatch(setNotificationUpdated(true));
            setIsPreferenceChanged(false)
        }

    };

    const handleDailySummaryToggle = () => {
        if (!dailySummary) {
            setDailySummary(true);
            setInstantNotification(false);
        } else {
            setDailySummary(false);
            setInstantNotification(true);
        }
        setIsPreferenceChanged(true)
    };

    const handleInstantToggle = () => {
        if (!instantNotification) {
            setInstantNotification(true);
            setDailySummary(false);
        } else {
            setInstantNotification(false);
            setDailySummary(true);
        }
        setIsPreferenceChanged(true)
    };

    const handlePendingActionNotification = () => {
        setPendingActionNotification(!pendingActionNotification)
        setIsPreferenceChanged(true)
    };

    return (
        <div className="notification-preferences-container aem-GridColumn aem-GridColumn--default--12">
            <div className="notification-preferences-paper">
                <h4 className="notification__title">{props?.title}</h4>
                <p className="notification__desc">{props?.description}</p>

                {/* Daily Summary Section */}
                <div className="notification-section">
                    <h6 className="primarySub_title">{props?.primarySubTitle}</h6>
                    <p className="primarySub_desc">{props?.primarySubDescription}</p>

                    <div className="toggle-section">

                        <div className="toggle-control">
                            <span>Off</span>
                            <ToggleSwitch
                                checked={dailySummary}
                                onChange={handleDailySummaryToggle}
                            ></ToggleSwitch>
                            <span>On</span>
                        </div>
                        {/* Instant Checkbox */}
                        <div className="checkbox-section">
                            <Checkbox
                                checked={pendingActionNotification}
                                disabled={!dailySummary}
                                onClick={handlePendingActionNotification}
                                color="primary"
                            />
                            <span>{props?.checkboxDescription}</span>
                        </div>
                    </div>
                </div>

                <div className="divider" />
                {/* Instant Toogle */}
                <div className="notification-section">
                    <h6 className="primarySub_title">{props?.secondarySubTitle}</h6>
                    <p className="primarySub_desc">{props?.secondarySubDescription}</p>
                    <div className="toggle-section">
                        <div className="toggle-control">
                            <span>Off</span>
                            <ToggleSwitch
                                color="primary"
                                checked={instantNotification}
                                onChange={handleInstantToggle}
                            />
                            <span>On</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default MapTo('ECCHub/components/nextgen/caseemailnotification')(EmailDeliveryPreferences, NextGenNotificationConfig);
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    emailPreference: null,
    isNotificationUpdated: false,
    isNotificationReset: false,
    
};

const emailPreferenceSlice = createSlice({
    name: 'emailPreference',
    initialState,
    reducers: {
        updateEmailPreference: (state, action) => {
            state.emailPreference = action.payload;
        },
        setNotificationUpdated: (state, action) => {
            state.isNotificationUpdated = action.payload;
        },
        setNotificationReset: (state, action) => {
            state.isNotificationReset = action.payload;
        },
    },
});

export const { updateEmailPreference, setNotificationUpdated, setNotificationReset } = emailPreferenceSlice.actions;
export default emailPreferenceSlice.reducer;

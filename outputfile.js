import {MapTo} from '@adobe/aem-react-editable-components';
import React, {useEffect} from 'react';
import {Checkbox} from '@material-ui/core';
import {ToggleSwitch} from '../ToggleSwitch';
import getEmailDeliveryPreferences from '../../../../Services/getEmailDeliveryPreferences';
import {
    setEmailPreferencesInitialValues,
    updateEmailPreferenceToggle,
} from '../../../../store/CommunicationNotification/EmailPreferenceSlice';
import {useDispatch, useSelector} from 'react-redux';
import {loadingIndicatorActions} from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';
import {dataLayerAccountNotifications}  from "../../../../utils/analyticsUtils";


const NextGenNotificationConfig = {
    emptyLabel: 'CCH Case Email Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};

const EmailDeliveryPreferences = (props) => {
    const currentEmailPreference = useSelector((state) => state.emailPreferenceSlice.emailPreferences.current);


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        getEmailDeliveryPreferences().then(response => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
            if (response.records && response.records.length > 0) {
                const preference = response.records[0].Case_Email_Delivery_Preference__c;
                updateToggleStatus(preference ? preference : null);
            } else {
                updateToggleStatus(null);
            }
        }).catch(error => {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
        });
    }, [dispatch]);

    const updateToggleStatus = (preference) => {
        switch (preference) {
            case null:
            case "Normal":
                dispatch(setEmailPreferencesInitialValues({
                    dailySummary: false,
                    instantNotification: true,
                    pendingActionNotification: false
                }));
                break;
            case "Digest Only":
                dispatch((setEmailPreferencesInitialValues({
                    dailySummary: true,
                    instantNotification: false,
                    pendingActionNotification: false
                })));
                break;
            case "Digest and Pending":
                dispatch(setEmailPreferencesInitialValues({
                    dailySummary: true,
                    instantNotification: false,
                    pendingActionNotification: true
                }));
                break;
            default:
                dispatch(setEmailPreferencesInitialValues({
                    dailySummary: false,
                    instantNotification: true,
                    pendingActionNotification: false
                }));
                break;
        }
    }


    const handleToggle = (key) => {
        const newValue = currentEmailPreference ? !currentEmailPreference[key] : false;

        if (key === 'dailySummary') {
            if (newValue) {
                // Turn on 'dailySummary' and ensure 'instantNotification' is off
                dispatch(updateEmailPreferenceToggle({key: 'instantNotification', value: false}));
                dataLayerAccountNotifications("daily summary off to on")
                dataLayerAccountNotifications("instant on to off")
            } else {
                // If turning off 'dailySummary', make sure 'instantNotification' is on
                dispatch(updateEmailPreferenceToggle({key: 'instantNotification', value: true}));
                dispatch(updateEmailPreferenceToggle({key: 'pendingActionNotification', value: false}));
                dataLayerAccountNotifications("daily summary on to off")
                dataLayerAccountNotifications("instant off to on")
            }
        } else if (key === 'instantNotification') {
            if (newValue) {
                // Turn on 'instantNotification' and ensure 'dailySummary' is off
                dispatch(updateEmailPreferenceToggle({key: 'dailySummary', value: false}));
                dispatch(updateEmailPreferenceToggle({key: 'pendingActionNotification', value: false}));
                dataLayerAccountNotifications("instant off to on")
                dataLayerAccountNotifications("daily summary on to off")
            } else {
                // If turning off 'instantNotification', make sure 'dailySummary' is on
                dispatch(updateEmailPreferenceToggle({key: 'dailySummary', value: true}));
                dataLayerAccountNotifications("instant on to off")
                dataLayerAccountNotifications("daily summary off to on")
            }
        }

        // Finally, update the current key with its new value
        dispatch(updateEmailPreferenceToggle({key, value: newValue}));
    };

    return (
        <div className="notification-preferences-container ">
            <div className="notification-preferences-paper">
                <h4 className="notification__title">{props?.title}</h4>
                <p className="notification__desc">{props?.description}</p>

                {/* Daily Summary Section */}
                <div className="notification-section">
                    <h6 className="primarySub_title">{props?.primarySubTitle}</h6>
                    <p className="primarySub_desc">{props?.primarySubDescription}</p>
                </div>
                <div className="toggle-section">
                    <div className="toggle-control">
                        <span>Off</span>
                        <ToggleSwitch
                            checked={currentEmailPreference?.dailySummary || false}
                            onChange={() => handleToggle('dailySummary')}
                        ></ToggleSwitch>
                        <span>On</span>
                    </div>
                    {/* Instant Checkbox */}
                    <div className="checkbox-section">
                        <Checkbox
                            checked={currentEmailPreference?.pendingActionNotification || false}
                            disabled={!currentEmailPreference?.dailySummary || false}
                            onClick={() => handleToggle('pendingActionNotification')}
                            color="primary"
                        />
                        <span className='instant_checkbox'>{props?.checkboxDescription}</span>
                    </div>
                </div>


                <div className="divider"/>
                {/* Instant Toogle */}
                <div className="notification-section">
                    <h6 className="primarySub_title">{props?.secondarySubTitle}</h6>
                    <p className="primarySub_desc">{props?.secondarySubDescription}</p>
                    <div className="toggle-section">
                        <div className="toggle-control">
                            <span>Off</span>
                            <ToggleSwitch
                                color="primary"
                                checked={currentEmailPreference?.instantNotification || false}
                                onChange={() => handleToggle('instantNotification')}
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

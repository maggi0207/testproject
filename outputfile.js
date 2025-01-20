import { MapTo } from '@adobe/aem-react-editable-components';
import React, { useState, useEffect } from 'react';
import { ToggleSwitch } from '../ToggleSwitch';
import getDistributionListMembers from '../../../../Services/getDistributionListMembers';
import getDistributionListNames from '../../../../Services/getDistributionListNames';
import { useDispatch, useSelector } from 'react-redux';
import {
    resetValues,
    setCommunicationPreferencesInitialValues,
    updateCommunicationPreferenceToggle
} from '../../../../store/CommunicationNotification/EmailPreferenceSlice';
import updateDistributionListMembers from '../../../../Services/updateDistributionListMembers';
import { loadingIndicatorActions } from '../../../../store/LoadingIndicator/LoadingIndicatorSlice';
import ToastNotification from '../ToastNotification';

const CommunicationMessageNotificationsConfig = {
    emptyLabel: 'CCH Communication Message Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};

const CommunicationDistributionListMembers = (props) => {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '', fromApi: '' });
    const [userNotInDL, setUserNotInDL] = useState(false);
    const [distributionListNames, setDistributionListNames] = useState([]); // All list names
    const [existingItems, setExistingItems] = useState([]); // Separate list for existing items
    const [toggleStates, setToggleStates] = useState({}); // State to handle toggles dynamically

    const isCommicationPreferencesModified = useSelector((state) => state.emailPreferenceSlice.isCommicationPreferencesModified);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));

        // Fetch Distribution List Members
        getDistributionListMembers()
            .then((response) => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                if (response.records && response.records.length > 0) {
                    const initialToggles = {};
                    const existing = [];
                    response.records.forEach((record) => {
                        const listName = record.Distribution_List__r?.Name;
                        const deliveryMethod = record.Delivery_Method__c;
                        const listType = record.Distribution_List__r?.attributes?.type;

                        // Initialize toggles
                        initialToggles[listName] = deliveryMethod === 'Email';

                        // Add to existing items
                        existing.push({
                            type: listType,
                            name: listName,
                        });
                    });
                    setToggleStates(initialToggles); // Set initial toggle states
                    setExistingItems(existing); // Set existing items
                } else {
                    setUserNotInDL(true);
                }
            })
            .catch((error) => {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
                console.error('Error fetching distribution list members:', error);
            });

        // Fetch Distribution List Names
        getDistributionListNames()
            .then((response) => {
                if (response.records && response.records.length > 0) {
                    setDistributionListNames(response.records.map((item) => item.Name));
                }
            })
            .catch((error) => {
                console.error('Error fetching distribution list names:', error);
            });
    }, [dispatch]);

    const handleToggleChange = (listName) => {
        setToggleStates((prevState) => ({
            ...prevState,
            [listName]: !prevState[listName],
        }));
    };

    const submitButtonHandler = async () => {
        const orderedUpdateNames = [];
        const orderedCreateNames = [];
        const requestObj = {};

        // Populate `ordered_update_names` for existing items
        existingItems.forEach((item) => {
            const listName = item.name;
            const deliveryMethod = toggleStates[listName] ? 'Email' : ''; // Determine delivery method
            orderedUpdateNames.push(listName);
            requestObj[listName] = deliveryMethod;
        });

        // Populate `ordered_create_names` for new items
        distributionListNames.forEach((listName) => {
            if (!existingItems.some((item) => item.name === listName)) {
                const isModified = toggleStates[listName] !== false; // Compare against default value
                if (isModified) {
                    const deliveryMethod = toggleStates[listName] ? 'Email' : ''; // Determine delivery method
                    orderedCreateNames.push(listName);
                    requestObj[listName] = deliveryMethod;
                }
            }
        });

        // Final payload for communication preferences
        const payload = {
            pathSuffix: 'udlm',
            requestObj: {
                ordered_update_names: orderedUpdateNames,
                ordered_create_names: orderedCreateNames,
                ...requestObj,
            },
        };

        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: true }));

        try {
            if (isCommicationPreferencesModified) {
                const response = await updateDistributionListMembers(payload);
                setAlert({
                    open: true,
                    severity: 'success',
                    message: 'Preferences updated successfully',
                    fromApi: 'updateDL',
                });
            }
        } catch (error) {
            console.error('Error updating communication preferences:', error);
            setAlert({
                open: true,
                severity: 'error',
                message: 'Failed to update communication preferences',
                fromApi: 'updateDL',
            });
        } finally {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({ isLoading: false }));
        }
    };

    const cancelButtonHandler = () => {
        dispatch(resetValues());
    };

    const handleCloseAlert = () => setAlert({ ...alert, open: false });

    return (
        <>
            <div className="communication-preferences-container">
                <div className="communication-preferences-paper">
                    <h4 className="notification__title">{props?.titlePreferences}</h4>
                    <p className="notification__desc">{props?.descriptionPreferences}</p>

                    {/* Dynamic Preference Rows */}
                    {distributionListNames.map((listName, index) => (
                        <div className="preference-row" key={index}>
                            <div className="toggle-group">
                                <div className="preference-label">
                                    <strong>Message Type</strong>
                                    <div>{listName}</div>
                                </div>
                                <div className="toggle-control">
                                    <span>Off</span>
                                    <ToggleSwitch
                                        checked={toggleStates[listName] || false}
                                        onChange={() => handleToggleChange(listName)}
                                        color="primary"
                                    />
                                    <span>On</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Existing Items */}
                {existingItems.length > 0 && (
                    <div className="existing-items-container">
                        <h4>Existing Items</h4>
                        {existingItems.map((item, index) => (
                            <div className="preference-row" key={index}>
                                <div className="toggle-group">
                                    <div className="preference-label">
                                        <strong>Type</strong>
                                        <div>{item.type}</div>
                                    </div>
                                    <div className="preference-label">
                                        <strong>Name</strong>
                                        <div>{item.name}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="notification-update-button-container">
                <div className="button-row">
                    <button
                        className="btn-primary"
                        type="button"
                        onClick={submitButtonHandler}
                    >
                        {props?.submitBtnLabel}
                    </button>
                    <button
                        className="btn-secondary"
                        type="button"
                        onClick={cancelButtonHandler}
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
        </>
    );
};

export default MapTo('ECCHub/components/nextgen/communicationmessagenotifications')(
    CommunicationDistributionListMembers,
    CommunicationMessageNotificationsConfig
);

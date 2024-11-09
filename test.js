import { MapTo } from '@adobe/aem-react-editable-components';
import React, { useEffect, useState } from 'react';
import '../../../../design/components/_caseEmailNotification.scss';
import { Checkbox, Switch, Typography } from '@material-ui/core';
import { ToggleSwitch } from '../Togglewitch';
import getEmailDeliveryPreferences from '../../../../Services/getEmailDeliveryPreferences';


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

    useEffect(() => {
        getEmailDeliveryPreferences().then(response => {
            const preference = response.records[0].Case_Email_Delivery_Preference__c;
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
        });
    }, []);

    const handleDailySummaryToggle = () => {
        if (!dailySummary) {
            setDailySummary(true);
            setInstantNotification(false);
        } else {
            setDailySummary(false);
            setInstantNotification(true);
        }
    };
    
    const handleInstantToggle = () => {
        if (!instantNotification) {
            setInstantNotification(true);
            setDailySummary(false);
        } else {
            setInstantNotification(false);
            setDailySummary(true);
        }
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
                                disabled ={!dailySummary}
                                onClick={() => setPendingActionNotification(!pendingActionNotification)}
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

import { MapTo } from '@adobe/aem-react-editable-components';
import { Switch, Tooltip, Typography } from '@material-ui/core';
import '../../../../design/components/_communicationMessageNotifications.scss';

import { useEffect, useState } from 'react';
import { ToggleSwitch } from '../Togglewitch';
import getDistributionListMembers from '../../../../Services/getDistributionListMembers';

const CommunicationMessageNotificationsConfig = {
    emptyLabel: 'CCH Communication Message Notification',

    isEmpty: function (props) {
        return !props || !props.heading;
    },
};


const CommunicationDistributionListMembers = (props) => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [webNotifications, setWebNotifications] = useState(true);

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

    return (
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
    );


}


export default MapTo('ECCHub/components/nextgen/communicationmessagenotifications')(CommunicationDistributionListMembers, CommunicationMessageNotificationsConfig);


import React, { useState } from 'react';
import {MapTo} from '@adobe/aem-react-editable-components';

import { Modal } from './Modal/Modal';
import { redirect } from '../../../utils/genericUtil';

const ButtonEditConfig = {
    emptyLabel: 'Button',

    isEmpty: function(props) {
        return true;
    }
};

export const ButtonComp = (buttonProps) => {
    // Destructuring button component props.
    const { action, url, styling, linkType, buttonLabel, iconPicker, buttonList } = buttonProps;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="gw__button mob-btn-cont" id={buttonProps?.id} data-analytics-component="Button">
            {/* Redirects user to authored URL in same/new tab depending on linkType or sets setIsOpen state to true to show Modal */}
            <button
                className={`btn-${styling}`} role='button'
                onClick={() => action === 'link' && buttonProps ? redirect(linkType, url) : setIsOpen(true)}
            >
            <i className={`${buttonProps?.iconPicker ?iconPicker:''}`}></i>
                {buttonLabel}

            </button>

            {buttonList?.map(btnMulti => {
                return(
                <button
                    className={`btn-${btnMulti.styling} extra-buttons`}  role='button'
                    onClick={() => btnMulti.action === 'link' && buttonProps ? redirect(btnMulti.linkType, btnMulti.url) : setIsOpen(true)}
                >
                <i className={`${btnMulti?.iconPicker ?btnMulti.iconPicker:''}`}></i>
                    {btnMulti.buttonLabel}

                </button>
            )})}

            {/* Shows Modal component if isOpen state is true. */}
            {isOpen ?
               <Modal isOpen={isOpen} setIsOpen={setIsOpen} /> : ''
            }
        </div>
    );
};

export default MapTo('ECCHub/components/nextgen/button')(ButtonComp,ButtonEditConfig);

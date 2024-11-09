import React, { useState } from 'react';
import EmailDeliveryPreferences from './EmailDeliveryPreferences';
import CommunicationDistributionListMembers from './CommunicationDistributionListMembers';
import ButtonComp from './ButtonComp';
import axios from 'axios';

const NotificationPreferences = () => {
    // State to capture toggle values from different components
    const [dailySummary, setDailySummary] = useState(true);
    const [instantNotification, setInstantNotification] = useState(false);
    const [pendingActionNotification, setPendingActionNotification] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [webNotifications, setWebNotifications] = useState(true);

    // Function to handle Update button click
    const handleUpdateClick = async () => {
        const payload = {
            dailySummary,
            instantNotification,
            pendingActionNotification,
            emailNotifications,
            webNotifications
        };

        try {
            await axios.post('/api/notification-preferences', payload);
            alert("Preferences updated successfully!");
        } catch (error) {
            console.error("Error updating preferences:", error);
        }
    };

    return (
        <div>
            <EmailDeliveryPreferences
                dailySummary={dailySummary}
                setDailySummary={setDailySummary}
                instantNotification={instantNotification}
                setInstantNotification={setInstantNotification}
                pendingActionNotification={pendingActionNotification}
                setPendingActionNotification={setPendingActionNotification}
            />
            <CommunicationDistributionListMembers
                emailNotifications={emailNotifications}
                setEmailNotifications={setEmailNotifications}
                webNotifications={webNotifications}
                setWebNotifications={setWebNotifications}
            />
            <ButtonComp buttonLabel="Update" action="update" onClick={handleUpdateClick} />
        </div>
    );
};

export default NotificationPreferences;

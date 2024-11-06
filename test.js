import React, { useState } from 'react';
import { Typography, Switch, Checkbox } from '@mui/material';
import './EmailNotificationPreferences.css';

const EmailNotificationPreferences = () => {
  const [dailySummary, setDailySummary] = useState(true);
  const [instantNotification, setInstantNotification] = useState(false);
  const [pendingActionNotification, setPendingActionNotification] = useState(true);

  const handleDailySummaryToggle = () => {
    setDailySummary(!dailySummary);
    if (!dailySummary) setInstantNotification(false); // Automatically disable instant notifications
  };

  const handleInstantToggle = () => {
    setInstantNotification(!instantNotification);
    if (!instantNotification) setDailySummary(false); // Automatically disable daily summary
  };

  return (
    <div className="notification-preferences-container">
      <div className="notification-preferences-paper">
        <Typography variant="h6" gutterBottom>
          Case email notification preferences
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Select case email notification preferences below.
        </Typography>

        {/* Daily Summary Section */}
        <div className="notification-section">
          <Typography variant="subtitle1">Daily summary</Typography>
          <Typography variant="body2" color="textSecondary" className="notification-description">
            Receive a daily summary of case updates made the previous day. You may also opt-in to receive
            instant notifications for case updates that require action from you. Disabling daily summary 
            automatically enables instant notifications.
          </Typography>
          <div className="toggle-section">
            <div className="toggle-label">Daily Summary</div>
            <Switch
              checked={dailySummary}
              onChange={handleDailySummaryToggle}
              color="primary"
            />
            {dailySummary && (
              <div className="checkbox-section">
                <Checkbox
                  checked={pendingActionNotification}
                  onChange={() => setPendingActionNotification(!pendingActionNotification)}
                  color="primary"
                />
                <span>Instant notifications for cases pending my action</span>
              </div>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* Instant Notification Section */}
        <div className="notification-section">
          <Typography variant="subtitle1">Instant</Typography>
          <Typography variant="body2" color="textSecondary" className="notification-description">
            Receive email notifications for case updates as they happen. Enabling instant notifications only 
            disables the daily summary emails.
          </Typography>
          <div className="toggle-section">
            <div className="toggle-label">Instant Notification</div>
            <Switch
              checked={instantNotification}
              onChange={handleInstantToggle}
              color="primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotificationPreferences;

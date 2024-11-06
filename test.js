$primary-color: #3f51b5;
$description-color: #666;
$divider-color: #e0e0e0;

.notification-preferences-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .notification-preferences-paper {
    padding: 20px;
    max-width: 500px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    
    h6 {
      font-weight: bold;
    }

    .notification-section {
      margin-bottom: 16px;

      .notification-description {
        color: $description-color;
        margin-top: 8px;
      }

      .toggle-section {
        display: flex;
        align-items: center;
        margin-top: 8px;

        .toggle-label {
          flex: 1;
          font-weight: 500;
          margin-right: 8px;
        }

        .checkbox-section {
          display: flex;
          align-items: center;
          margin-left: 16px;

          span {
            margin-left: 4px;
          }
        }
      }
    }

    .divider {
      height: 1px;
      background-color: $divider-color;
      margin: 16px 0;
    }
  }
}


import React, { useState } from 'react';
import { Typography, Switch, Checkbox } from '@mui/material';
import './EmailNotificationPreferences.scss';

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

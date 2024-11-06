import React, { useState } from 'react';
import { Typography, Switch } from '@mui/material';
import './CommunicationNotificationPreferences.scss';

const CommunicationNotificationPreferences = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webNotifications, setWebNotifications] = useState(true);

  return (
    <div className="communication-preferences-container">
      <div className="communication-preferences-paper">
        <Typography variant="h6" gutterBottom>
          Communication notification preferences
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Select Communication message notifications preferences below.
        </Typography>

        <div className="preference-toggles-row">
          <div className="toggle-group">
            <Typography variant="subtitle1">Email notifications</Typography>
            <div className="toggle-control">
              <span>Off</span>
              <Switch
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                color="primary"
              />
              <span>On</span>
            </div>
          </div>
          <div className="toggle-group">
            <Typography variant="subtitle1">Web notifications</Typography>
            <div className="toggle-control">
              <span>Off</span>
              <Switch
                checked={webNotifications}
                onChange={() => setWebNotifications(!webNotifications)}
                color="primary"
              />
              <span>On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

$description-color: #666;

.communication-preferences-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  .communication-preferences-paper {
    padding: 20px;
    max-width: 600px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

    h6 {
      font-weight: bold;
    }

    .preference-toggles-row {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;

      .toggle-group {
        display: flex;
        flex-direction: column;
        align-items: center;

        .toggle-control {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 4px;

          span {
            color: $description-color;
          }
        }
      }
    }
  }
}


export default CommunicationNotificationPreferences;

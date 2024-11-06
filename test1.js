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

export default CommunicationNotificationPreferences;

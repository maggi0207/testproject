import React, { useState } from 'react';
import { Typography, Switch, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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

        <div className="preference-row">
          <div className="preference-label">
            <Typography variant="subtitle1">
              Payer processing issues
              <Tooltip title="Notifications related to payer processing issues" arrow>
                <InfoOutlinedIcon className="info-icon" />
              </Tooltip>
            </Typography>
          </div>
          <div className="preference-toggles">
            <div className="toggle-group">
              <span>Email notifications</span>
              <Switch
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                color="primary"
              />
            </div>
            <div className="toggle-group">
              <span>Web notifications</span>
              <Switch
                checked={webNotifications}
                onChange={() => setWebNotifications(!webNotifications)}
                color="primary"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationNotificationPreferences;

$primary-color: #3f51b5;
$description-color: #666;
$divider-color: #e0e0e0;

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

    .preference-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;

      .preference-label {
        display: flex;
        align-items: center;

        .info-icon {
          font-size: 20px;
          color: $description-color;
          margin-left: 4px;
          cursor: pointer;
        }
      }

      .preference-toggles {
        display: flex;
        
        .toggle-group {
          display: flex;
          align-items: center;
          margin-left: 20px;

          span {
            margin-right: 8px;
            color: $description-color;
          }
        }
      }
    }
  }
}


/* CommunicationNotificationPreferences.scss */
.custom-switch {
  & .MuiSwitch-switchBase.Mui-checked {
    color: green; /* Ball color when checked */
  }

  & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: green; /* Track color when checked */
  }
}

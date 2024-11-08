/* CommunicationNotificationPreferences.scss */
.custom-switch {
  & .MuiSwitch-switchBase.Mui-checked {
    color: #fff;  /* Ball color when checked (white) */
  }

  & .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
    background-color: #65C466;  /* Track color when checked (green) */
  }

  /* Optional: Styling for when the switch is focused */
  & .MuiSwitch-focusVisible .MuiSwitch-thumb {
    color: #33cf4d; /* Focused thumb color */
    border: 6px solid #fff; /* Border around thumb when focused */
  }

  /* Styling for disabled state */
  & .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track {
    opacity: 0.5;  /* Track opacity when disabled */
  }

  & .MuiSwitch-switchBase.Mui-disabled {
    color: #bdbdbd;  /* Thumb color when disabled */
  }

  /* Optional: Track color when the switch is off */
  & .MuiSwitch-track {
    background-color: #E9E9EA;  /* Default track color */
    transition: background-color 0.3s ease;
  }
}

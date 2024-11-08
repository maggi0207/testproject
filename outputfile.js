/* CommunicationNotificationPreferences.scss */
.custom-switch  {
  width: 42px;
  height: 26px;
  padding: 0;

  .MuiSwitch-switchBase {
    padding: 0;
    margin: 2px;
    transition-duration: 300ms;

    &.Mui-checked {
      transform: translateX(16px);
      color: #fff;

      & + .MuiSwitch-track {
        background-color: #65c466;
        opacity: 1;
        border: 0;
      }

      &.Mui-focusVisible + .MuiSwitch-track {
        background-color: #2eca45;
      }

      &.Mui-disabled + .MuiSwitch-track {
        opacity: 0.5;
      }
    }

    &.Mui-focusVisible .MuiSwitch-thumb {
      color: #33cf4d;
      border: 6px solid #fff;
    }

    &.Mui-disabled .MuiSwitch-thumb {
      color: #e0e0e0; // gray equivalent for disabled state
    }

    &.Mui-disabled + .MuiSwitch-track {
      opacity: 0.7;
    }
  }

  .MuiSwitch-thumb {
    box-sizing: border-box;
    width: 22px;
    height: 22px;
  }

  .MuiSwitch-track {
    border-radius: 50%;
    background-color: #e9e9ea;
    opacity: 1;
    transition: background-color 500ms ease-in-out;

    &.Mui-checked {
      background-color: #65c466;
    }
  }

  &.dark {
    .MuiSwitch-switchBase {
      &.Mui-checked {
        & + .MuiSwitch-track {
          background-color: #2eca45;
        }
      }

      &.Mui-disabled + .MuiSwitch-track {
        opacity: 0.3;
      }
    }

    .MuiSwitch-track {
      background-color: #39393d;
    }

    .MuiSwitch-thumb {
      color: #757575; // Grey for dark mode disabled thumb
    }
  }
}

$primary-color: #002677;
$description-color: #666;
$divider-color: #e0e0e0;
$header-font-type: 'Enterprise Sans Bold', Arial, sans-serif;
$neutral100: #323334;

.notification__title {
  font-family: 'Enterprise Sans Bold';
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: left;  // left-align title text
}

.notification__desc {
  font-size: 16px;
  font-family: 'Enterprise Sans Regular';
  color: #4B4D4F;
  border-bottom: 1px solid #dee4ec;
  padding-bottom: 24px;
  width: 100%;
  text-align: left;  // left-align description text
}

.primarySub_title {
  color: #4B4D4F;
  margin-top: 14px;
  margin-bottom: 16px;
  line-height: 24px;
  width: 100%;
  font-family: 'Enterprise Sans Regular';
  font-size: 20px;
  text-align: left;  // left-align subtitle
}

.primarySub_desc {
  font-family: 'Enterprise Sans Regular';
  color: #4B4D4F;
  margin-top: 8px;
  font-size: 16px;
  width: 100%;
  text-align: left;  // left-align sub-description
}

.notification-preferences {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  &__container {
    max-width: 1040px;
    margin: 20px;
    width: auto;
    padding: 0 20px;

    .notification-preferences-paper {
      padding: 20px;
      max-width: 100%;
      background-color: white;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid #E5E6E6;

      .notification__title, .primarySub_title, .primarySub_desc {
        font-size: 18px;
        text-align: left;  // left-align all main text elements

        @media only screen and (max-width: 768px) {
          font-size: 16px;
        }
      }

      .notification-section, .toggle-section {
        display: flex;
        flex-direction: column;
        align-items: flex-start;  // left-align all sections
        margin: 16px 0;

        @media only screen and (min-width: 768px) {
          flex-direction: row;
          align-items: center;
        }
      }

      .toggle-control {
        width: 100%;
        display: flex;
        justify-content: flex-start;  // left-align toggle control
        margin-top: 10px;
      }

      .checkbox-section {
        margin-left: 0;
        margin-top: 10px;
        display: flex;
        align-items: center;
        
        @media only screen and (min-width: 768px) {
          margin-left: 20px;
        }

        .instant_checkbox {
          margin-left: 4px;
          color: $neutral100;
          font-size: 16px;
          text-align: left;  // ensure checkbox label is left-aligned
        }
      }

      .button-container {
        display: flex;
        justify-content: flex-start;  // left-align buttons
        margin-top: 16px;
        
        button {
          margin-right: 10px;  // add spacing between buttons without center alignment
        }
      }

      .divider {
        height: 1px;
        background-color: $divider-color;
        margin: 16px 0;
      }
    }
  }
}

.custom-switch {
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
      color: #e0e0e0;
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
  }
}

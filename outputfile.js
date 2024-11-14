$primary-color: #002677;
$description-color: #666;
$divider-color: #e0e0e0;
$header-font-type: 'Enterprise Sans Bold', Arial, sans-serif;
$neutral100: #323334;


.notification__title {
  font-family: 'Enterprise Sans Bold';
  width: 904px;
  height: 24px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.notification__desc {
  font-size: 16px;
  font-family: 'Enterprise Sans Regular';
  color: #4B4D4F;
  border-bottom: 1px solid #dee4ec;
  padding-bottom: 24px;
}

.primarySub_title {
  color: #4B4D4F;
  margin-top: 14px;
  margin-bottom: 16px;
  line-height: 24px;
  width: 725px;
  height: 24px;
  font-family: 'Enterprise Sans Regular';
  font-size: 20px;
}


.primarySub_desc {
  font-family: 'Enterprise Sans Regular';
  color: #4B4D4F;
  margin-top: 8px;
  font-size: 16px;
  //color: rgba(0, 0, 0, 0.54);
}

.notification-preferences {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  &__container {
    max-width: 1040px;
    margin: 20px;
    position: relative;
    width: auto;
    @media only screen and (min-width: 1024px) {
      padding: 0 50px;
      margin: 20px auto;
    }
    @media only screen and (min-width: (1024px + 1)) {
      padding: 0;
    }
  }



  .notification-preferences-paper {
    padding: 20px;
    max-width: 100%;
    background-color: white;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid #E5E6E6;


    .title {
      color: $primary-color;
    }

    h6 {
      font-weight: bold;
    }

    .notification-section {
      margin-bottom: 16px;
      margin-right: 200px;
    }

    .toggle-section {
      display: flex;
      align-items: center;
      margin-top: 24px;

      .toggle-control {
        display: flex;
        align-items: center;
        width: 105px;
        justify-content: space-between;
      }

      .toggle-label {
        flex: 1;
        font-weight: 500;
        margin-right: 4px;
      }

      .checkbox-section {
        display: flex;
        align-items: center;
        margin-left: 185px;

        .instant_checkbox {
          margin-left: 4px;
          color: $neutral100;
          font-size: 16px;

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

 <div className="notification-preferences__container">
            <div className="preference__container">
            <div className="notification-preferences-paper">
                <h4 className="notification__title">{props?.title}</h4>
                <p className="notification__desc">{props?.description}</p>

                {/* Daily Summary Section */}
                <div className="notification-section">
                    <h6 className="primarySub_title">{props?.primarySubTitle}</h6>
                    <p className="primarySub_desc">{props?.primarySubDescription}</p>
                </div>
                <div className="toggle-section">
                    <div className="toggle-control">
                        <span>Off</span>
                        <ToggleSwitch
                            checked={currentEmailPreference?.dailySummary || false}
                            onChange={() => handleToggle('dailySummary')}
                        ></ToggleSwitch>
                        <span>On</span>
                    </div>
                    {/* Instant Checkbox */}
                    <div className="checkbox-section">
                        <Checkbox
                            checked={currentEmailPreference?.pendingActionNotification || false}
                            disabled={!currentEmailPreference?.dailySummary || false}
                            onClick={() => handleToggle('pendingActionNotification')}
                            color="primary"
                        />
                        <span className='instant_checkbox'>{props?.checkboxDescription}</span>
                    </div>
                </div>


                <div className="divider"/>
                {/* Instant Toogle */}
                <div className="notification-section">
                    <h6 className="primarySub_title">{props?.secondarySubTitle}</h6>
                    <p className="primarySub_desc">{props?.secondarySubDescription}</p>
                    <div className="toggle-section">
                        <div className="toggle-control">
                            <span>Off</span>
                            <ToggleSwitch
                                color="primary"
                                checked={currentEmailPreference?.instantNotification || false}
                                onChange={() => handleToggle('instantNotification')}
                            />
                            <span>On</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>

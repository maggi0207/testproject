.notification-preferences {
  display: flex;
  justify-content: center;
  margin-top: 20px;

  &__container {
    max-width: 1040px;
    margin: 20px;
    position: relative;
    width: auto;
    padding: 0 20px;

    @media only screen and (max-width: 768px) {
      padding: 0 10px;
    }

    .notification-preferences-paper {
      padding: 20px;
      max-width: 100%;
      background-color: white;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid #E5E6E6;

      .notification__title, .primarySub_title, .primarySub_desc {
        width: 100%; // Ensures the title takes full width on small screens
        font-size: 18px;

        @media only screen and (max-width: 768px) {
          font-size: 16px;
          text-align: center;
        }
      }

      .notification-section, .toggle-section {
        display: flex;
        flex-direction: column;
        margin: 16px 0;

        @media only screen and (min-width: 768px) {
          flex-direction: row;
          align-items: center;
        }
      }

      .toggle-control {
        width: auto;
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        @media only screen and (max-width: 768px) {
          justify-content: center;
          width: 100%;
        }
      }

      .checkbox-section {
        margin-left: 0;
        margin-top: 10px;
        display: flex;
        justify-content: center;

        @media only screen and (min-width: 768px) {
          margin-left: 20px;
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

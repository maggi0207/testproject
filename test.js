 describe(`<IneligibleDevicesModal component - ${channel}`, () => {
  let history; let store; let asFragment; let component;

    beforeEach(() => {
      window.mfe = { scmDeviceMfeEnable: true , isDark : true};
    })
    test('it should mount and test selected device', async () => {
      window.mfe.isDark = false;

      window.history.pushState(
        {},
        'PDP',
        '/sales/assisted/new/device/pdp.html?activeMtn=5139074854&iSscan=true&deviceSKU=MQ8R3LL/A&isLocal=true&deviceId=350321532631401&isByodUpdate=true'
      );
      sessionStorage.setItem('APP_PROPERTIES', JSON.stringify({ isLandingRedesignFlow: 'TRUE' }));
      ({ history, store, asFragment, component } = render(
        <IneligibleDevicesModal {...INELIGIBLE_DEVICE_MODAL_PROPS} />
      ));
      expect(screen.getByTestId('ineligibleDevicesModalupdate')).toBeInTheDocument();
      expect(screen.getByText('The selected device and offer are incompatible')).toBeInTheDocument();
      expect(screen.getByText('Continue with selected device')).toBeInTheDocument();
      expect(screen.getByText('Continue with selected offer')).toBeInTheDocument();
      expect(screen.getByText('Continue')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

      const radioBtn = screen.getByRole('radio', {
        name: 'Continue with selected device This will drop the selected offer',
      });
      fireEvent.click(radioBtn);
      const continueBtn = screen.getByRole('button', { name: 'Continue' });
      fireEvent.click(continueBtn);
    });

ReturnChoice.propTypes = {
  selectedDevice: PropTypes.object.isRequired,
  mdn: PropTypes.string.isRequired,
  setPreferredStoreId: PropTypes.func.isRequired,
  setPreferredStoreInfo: PropTypes.func.isRequired,
  preferredStoreInfo: PropTypes.object,
  chooseTradeInSelected: PropTypes.string.isRequired,
  updateChooseTradeInSelected: PropTypes.func.isRequired,
  setEnableContinue: PropTypes.func.isRequired,
  setCurrentSection: PropTypes.func.isRequired,
  selectedTradeStoreId: PropTypes.string,
  setDefaultZipCode: PropTypes.func.isRequired,
  cartDetails: PropTypes.object.isRequired,
  isEnabledTradeReturnOptionsInContactCenterApps: PropTypes.bool.isRequired,
  customerType: PropTypes.string.isRequired
};

const propTypes = {
  selectedDevice: PropTypes.object,
  preferredStoreInfo: PropTypes.object,
  mdn: PropTypes.string,
  setPreferredStoreId: PropTypes.func,
  setPreferredStoreInfo: PropTypes.func,
  updateChooseTradeInSelected: PropTypes.func,
  chooseTradeInSelected: PropTypes.string,
  setEnableContinue: PropTypes.func,
  setCurrentSection: PropTypes.func,
  selectedTradeStoreId: PropTypes.string,
  setDefaultZipCode: PropTypes.func,
};

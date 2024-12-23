const BuyoutAmountModal = styled.div`
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  overflow-y: scroll;
  background: #0a0a0a;

  ${({ scmUpgradeMfeEnable }) =>
    scmUpgradeMfeEnable
      ? `
        z-index: 0;
        position: absolute;
      `
      : `
        z-index: 1000;
        position: fixed;
      `}
  
  ${({ showReturnChoiceScreen }) =>
    showReturnChoiceScreen &&
    `
    background-color: #ffffff !important;
  `}
`;

const EditTradeInBuyoutAmountModalInner = styled.div`
  ${({ isModalView }) =>
    isModalView
      ? `
    position: fixed;
    width: 64rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border: 1px solid #d3d3d3;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    border-radius: 8px;
    overflow: hidden; /* Prevent overlap */
  `
      : `
    position: absolute !important;
    width: 64rem !important;
    top: 0% !important;
    min-height: 100% !important;
    bottom: auto !important;
    margin: auto !important;
    left: 1% !important;
    right: 0% !important;
    background: #ffffff !important;
    border-top: 1px solid #d3d3d3;
  `}
`;

const EditTradeInHeaderContainer = styled.div`
  font-weight: 700 !important;
  font-family: BrandFontBold, Sans-serif !important;
  background-color: #ffffff;

  ${({ isModalView }) =>
    isModalView
      ? `
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 1rem;
    border-bottom: 1px solid #d8dada;
  `
      : `
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
  `}
`;

const TradeInModalBody = styled.div`
  background-color: #fff;

  ${({ isModalView }) =>
    isModalView
      ? `
    height: 50vh; /* Fixed modal height */
    overflow-y: auto; /* Scrollable body */
    padding: 1rem;
  `
      : `
    margin-top: 65px;
    margin-bottom: 65px !important;
    padding-top: 10px;
  `}
`;

const NoTradeIn = styled.div`
  text-align: center;
  width: 30%;
  margin: auto;
  top: 20vh;
  position: relative;
  font-size: 20px;
  line-height: 1.3;
`;

const TaxesFeesText = styled.p`
  text-align: center;
  margin-top: 0.5rem;
  font-size: 14px;
  color: #888;
`;

const EditTradeInFooterContainer = styled.div`
  background: #ffffff;
  text-align: center !important;

  ${({ isModalView }) =>
    isModalView
      ? `
    position: sticky;
    bottom: 0;
    z-index: 1;
    padding: 1rem;
    border-top: 1px solid #d8dada;
  `
      : `
    position: absolute;
    bottom: 0;
    width: 100%;
  `}
`;

const HeaderInnerDiv = styled.div`
  padding-top: 1.3125rem !important;
  padding-bottom: 1.3125rem !important;
  border-bottom: 1px solid #d8dada;

  ${({ isModalView }) =>
    isModalView
      ? `
    position: sticky;
    top: 0;
    width: 100%;
    background: #ffffff;
  `
      : `
    position: fixed;
    top: 0;
    width: 64rem;
    background: #ffffff;
  `}
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  background: #0078d4;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #005a9e;
  }
`;

const EditTradeInBuyoutAmountModal = ({
  isModalView = false, // Boolean toggle for modal view
  tradeInItems,
  EditTradeInHeader,
  EditTradeInBody,
  EditTradeInFooter,
  onClose,
}) => {
  return (
    <EditTradeInBuyoutAmountModalInner isModalView={isModalView} role={isModalView ? 'dialog' : ''} aria-modal={isModalView}>
      <EditTradeInHeaderContainer isModalView={isModalView}>
        {EditTradeInHeader}
      </EditTradeInHeaderContainer>

      {tradeInItems?.length > 0 ? (
        <TradeInModalBody isModalView={isModalView}>{EditTradeInBody}</TradeInModalBody>
      ) : (
        <div>
          <NoTradeIn>There are no current Trade-ins for this account</NoTradeIn>
          <TaxesFeesText>*Taxes and fees may adjust the trade in credit</TaxesFeesText>
        </div>
      )}

      <EditTradeInFooterContainer isModalView={isModalView}>
        {EditTradeInFooter}
        {isModalView && <CloseButton onClick={onClose}>Close</CloseButton>}
      </EditTradeInFooterContainer>
    </EditTradeInBuyoutAmountModalInner>
  );
};

export default EditTradeInBuyoutAmountModal;

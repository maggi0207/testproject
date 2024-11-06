const FooterArea = styled.div`
  background-color: ${(props) => (props.isDark ? props.bgColor : '#ffffff')};
  bottom: 0px;
  display: flex;
  flex-wrap: wrap;
  width: 252px;
  button:enabled:focus {
    color: white;
  }
`;

jest.mock('@costcolabs/forge-components', () => ({
  Text: ({ children }: any) => <span>{children}</span>,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  Button: ({ children, onClick, type = 'button', ...rest }: any) => (
    <button type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  FormikTextField: ({
    label,
    value,
    onChange,
    onBlur,
    isError,
    errorText,
    inputLabelId,
  }: any) => (
    <div>
      <label htmlFor={inputLabelId}>{label}</label>
      <input
        id={inputLabelId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={isError}
        aria-describedby={isError ? `${inputLabelId}-error` : undefined}
      />
      {isError && (
        <div id={`${inputLabelId}-error`} role="alert">
          {errorText}
        </div>
      )}
    </div>
  ),
  Divider: () => <hr />,
  Notification: ({ children, message }: any) => (
    <div role="status">
      {message}
      {children}
    </div>
  ),
  Link: ({ children, onClick }: any) => (
    <a role="button" onClick={onClick}>
      {children}
    </a>
  ),
  Skeleton: () => <div data-testid="skeleton">Loading...</div>,
  SkeletonVariant: {
    TextBody: 'textBody',
  },
  Box: ({ children }: any) => <div>{children}</div>,
  Stack: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@costcolabs/forge-design-tokens', () => ({
  SpaceMd: '16px',
  SpaceXs: '4px',
  // Add other tokens if used
}));


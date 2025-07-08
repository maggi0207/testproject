import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthUserCardUI } from "./AuthUserCardUI";
import mockPersonalManager from "#/src/mocks/authUserCard/mockPersonalManager.json";
import "@testing-library/jest-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;


jest.mock("@costcolabs/forge-components", () => ({
  Text: ({ children }: any) => <span>{children}</span>,
  Tooltip: ({ content }: any) => <div data-testid="tooltip">{content}</div>,
  Button: ({ children, onClick, ...rest }: any) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  TextField: ({ label, value, onChange, onBlur, isError, errorText, inputLabelId }: any) => (
    <div>
      <label htmlFor={inputLabelId}>{label}</label>
      <input
        id={inputLabelId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={isError}
      />
      {isError && <div role="alert">{errorText}</div>}
    </div>
  ),
  Divider: () => <hr />,
  Notification: ({ message }: any) => <div role="status">{message}</div>,
  Link: ({ children, onClick, ...rest }: any) => (
    <a onClick={onClick} role="button" {...rest}>
      {children}
    </a>
  ),
      CostcoFormikForm: ({ children }: any) => (
    <form onSubmit={(e) => e.preventDefault()}>
      {typeof children === 'function'
        ? children({
            values: {},
            errors: {},
            touched: {},
            handleChange: jest.fn(),
            handleBlur: jest.fn(),
            handleSubmit: jest.fn(),
            setFieldValue: jest.fn(),
            setFieldTouched: jest.fn(),
            isSubmitting: false,
          })
        : children}
    </form>
  ),
}));

jest.mock("@costcolabs/forge-digital-components", () => ({
  useAuth: () => ({
    isUserSignedIn: () => Promise.resolve(true),
    isLoading: false,
  }),
}));

const mockEntryData = mockPersonalManager;

describe("AuthUserCardUI", () => {
  it("renders title and tooltip", () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);
    expect(screen.getByText("Personal Account Manager")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toHaveTextContent(
      "A Personal Account Manager is a current Costco member"
    );
  });

  it("expands form when Add Account Manager button clicked", () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);
    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Membership Number")).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);
    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    });

    expect(screen.getAllByRole("alert")).toHaveLength(3);
  });

  it("clears validation error on field change", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);
    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    });

    expect(screen.getAllByRole("alert")).toHaveLength(3);

    fireEvent.change(screen.getByLabelText("Membership Number"), {
      target: { value: "123456" },
    });

    // Wait for error to disappear
    await waitFor(() => {
      expect(screen.getAllByRole("alert")).toHaveLength(2);
    });
  });

  it("submits successfully and shows confirmation", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);

    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));

    fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText("Membership Number"), {
      target: { value: "123456" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    });

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("Person has been added.");
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
      expect(screen.getByText("Remove")).toBeInTheDocument();
    });
  });

  it("resets and collapses form when Cancel is clicked", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);
    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));

    fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "John" } });

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByLabelText("First Name")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));
    expect(screen.getByLabelText("First Name")).toHaveValue(""); // Should be reset
  });

  it("removes user on remove click and shows removal confirmation", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} />);

    fireEvent.click(screen.getByRole("button", { name: "Add Account Manager" }));
    fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Smith" } });
    fireEvent.change(screen.getByLabelText("Membership Number"), {
      target: { value: "123456" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    });

    await waitFor(() => {
      expect(screen.getByText("Remove")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Remove"));

    // Click the actual confirm in modal (you can mock RemovePersonModal separately for unit test)
    // For now let's assume modal works and user is removed
    // So simulate modal close effect:
    await act(async () => {
      // Simulate modal's onRemove call
      screen.getByText("Remove").click();
    });

    // Simulate showing removal success message
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent("has been removed");
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthUserCardUI } from "./AuthUserCardUI";
import "@testing-library/jest-dom";
import mockEntryData from "#/src/mocks/authUserCard/mockPersonalManager.json";

// 🔥 No mocking for forge-components or forge-digital-components
// 👉 We'll test it as-is, assuming components render correctly

jest.mock("@costcolabs/forge-digital-components", () => {
  const originalModule = jest.requireActual("@costcolabs/forge-digital-components");

  return {
    ...originalModule,
    useAuth: () => ({
      isUserSignedIn: () => Promise.resolve(true),
      isLoading: false,
    }),
  };
});

describe("AuthUserCardUI", () => {
  const translations = {
    alertaddperson: "Person has been added.",
    alertremoveperson: "Person has been removed.",
    remove: "Remove",
  };

  it("renders the title and tooltip", () => {
    render(<AuthUserCardUI entryData={mockEntryData} translations={translations} />);
    expect(screen.getByText("Personal Account Manager")).toBeInTheDocument();
    expect(screen.getByLabelText("Personal Account Manager")).toBeInTheDocument();
  });

  it("opens form on 'Add Account Manager' button click", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} translations={translations} />);
    const addBtn = screen.getByRole("button", { name: /add account manager/i });
    fireEvent.click(addBtn);

    expect(await screen.findByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Membership Number/i)).toBeInTheDocument();
  });

  it("submits the form and shows confirmation", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Membership Number/i), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Person has been added.")).toBeInTheDocument();
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  it("resets the form when Cancel is clicked", async () => {
    render(<AuthUserCardUI entryData={mockEntryData} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));

    expect(await screen.findByLabelText(/First Name/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByLabelText(/First Name/i)).not.toBeInTheDocument();
    });
  });
});

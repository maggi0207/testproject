import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthUserCardUI from "../AuthUserCardUI";
import { useAuth } from "@costcolabs/connect-core";
import { mockPersonalManager, mockHouseholdData, mockAdditionalPeopleData } from "./mockData";

jest.mock("@costcolabs/connect-core");

describe("AuthUserCardUI - AccountManager", () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      isUserSignedIn: jest.fn().mockResolvedValue(true),
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const translations = mockPersonalManager.translations.value.reduce((acc, currVal) => {
    if (currVal?.key && currVal.value) acc[currVal.key] = currVal.value;
    return acc;
  }, {} as Record<string, string>);

  test("renders correctly", () => {
    render(<AuthUserCardUI translations={translations} entryData={mockPersonalManager} />);
    expect(screen.getByText("Personal Account Manager")).toBeInTheDocument();
    expect(screen.getByTestId("Tooltip_MMC")).toBeInTheDocument();
  });

  test("opens form on button click", () => {
    render(<AuthUserCardUI translations={translations} entryData={mockPersonalManager} />);
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
  });

  test("submits the form and shows confirmation", async () => {
    render(<AuthUserCardUI entryData={mockPersonalManager} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));

    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Membership Number/i), { target: { value: "12345678" } });

    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  test("resets the form on cancel", async () => {
    render(<AuthUserCardUI entryData={mockPersonalManager} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));
    await screen.findByLabelText(/First Name/i);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByLabelText(/First Name/i)).not.toBeInTheDocument();
    });
  });

  test("removes a person via modal", async () => {
    render(<AuthUserCardUI entryData={mockPersonalManager} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Jane" } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } });
    fireEvent.change(screen.getByLabelText(/Membership Number/i), { target: { value: "12345678" } });
    fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));

    await waitFor(() => {
      const removeBtn = screen.getByTestId("remove-person-0");
      fireEvent.click(removeBtn);
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Remove/i }));
      expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    });
  });
});

describe("AuthUserCardUI - Household", () => {
  const translations = mockHouseholdData.translations.value.reduce((acc, currVal) => {
    if (currVal?.key && currVal.value) acc[currVal.key] = currVal.value;
    return acc;
  }, {} as Record<string, string>);

  test("renders correctly", () => {
    render(<AuthUserCardUI translations={translations} entryData={mockHouseholdData} />);
    expect(screen.getByText("Household Members")).toBeInTheDocument();
  });

  test("opens form on button click", () => {
    render(<AuthUserCardUI translations={translations} entryData={mockHouseholdData} />);
    fireEvent.click(screen.getByRole("button", { name: /add household member/i }));
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
  });

test("submits the form and shows confirmation", async () => {
  render(<AuthUserCardUI entryData={mockHouseholdData} translations={translations} />);
  fireEvent.click(screen.getByRole("button", { name: /add household member/i }));

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Mark" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "mark@example.com" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "1234567890" } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1990-01-01" } });
  fireEvent.change(screen.getByLabelText(/Membership Number/i), { target: { value: "98765432" } });

  fireEvent.click(screen.getByRole("button", { name: /add household member/i }));

  await waitFor(() => {
    expect(screen.getByText("Mark Smith")).toBeInTheDocument();
  });
});


  test("resets the form on cancel", async () => {
    render(<AuthUserCardUI entryData={mockHouseholdData} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add household member/i }));
    await screen.findByLabelText(/First Name/i);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByLabelText(/First Name/i)).not.toBeInTheDocument();
    });
  });

  test("removes a person via modal", async () => {
    render(<AuthUserCardUI entryData={mockHouseholdData} translations={translations} />);
  fireEvent.click(screen.getByRole("button", { name: /add household member/i }));

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Mark" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "mark@example.com" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "1234567890" } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1990-01-01" } });
  fireEvent.change(screen.getByLabelText(/Membership Number/i), { target: { value: "98765432" } });

  fireEvent.click(screen.getByRole("button", { name: /add household member/i }));

    await waitFor(() => {
      fireEvent.click(screen.getByTestId("remove-person-0"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Remove/i }));
      expect(screen.queryByText("Mark Smith")).not.toBeInTheDocument();
    });
  });
});

describe("AuthUserCardUI - AdditionalPeopleDetails", () => {
  const translations = mockAdditionalPeopleData.translations.value.reduce((acc, currVal) => {
    if (currVal?.key && currVal.value) acc[currVal.key] = currVal.value;
    return acc;
  }, {} as Record<string, string>);

  test("renders correctly", () => {
    render(<AuthUserCardUI translations={translations} entryData={mockAdditionalPeopleData} />);
    expect(screen.getByText("Additional People")).toBeInTheDocument();
  });

  test("opens form on button click", () => {
    render(<AuthUserCardUI translations={translations} entryData={mockAdditionalPeopleData} />);
    fireEvent.click(screen.getByRole("button", { name: /add additional person/i }));
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
  });

  test("submits the form and shows confirmation", async () => {
    render(<AuthUserCardUI entryData={mockAdditionalPeopleData} translations={translations} />);
test("submits the form and shows confirmation", async () => {
  render(<AuthUserCardUI entryData={mockAdditionalPeopleData} translations={translations} />);
  fireEvent.click(screen.getByRole("button", { name: /add additional person/i }));

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Lily" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Wong" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "lily@example.com" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "9876543210" } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1985-06-15" } });
  fireEvent.change(screen.getByLabelText(/Address Line 1/i), { target: { value: "123 Main St" } });
  fireEvent.change(screen.getByLabelText(/Address Line 2/i), { target: { value: "Apt 4B" } });
  fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: "90210" } });
  fireEvent.change(screen.getByLabelText(/Membership Number/i), { target: { value: "11223344" } });

  fireEvent.click(screen.getByRole("button", { name: /add additional person/i }));

  await waitFor(() => {
    expect(screen.getByText("Lily Wong")).toBeInTheDocument();
  });
});


    await waitFor(() => {
      expect(screen.getByText("Lily Wong")).toBeInTheDocument();
    });
  });

  test("resets the form on cancel", async () => {
    render(<AuthUserCardUI entryData={mockAdditionalPeopleData} translations={translations} />);
    fireEvent.click(screen.getByRole("button", { name: /add additional person/i }));
    await screen.findByLabelText(/First Name/i);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    await waitFor(() => {
      expect(screen.queryByLabelText(/First Name/i)).not.toBeInTheDocument();
    });
  });

  test("removes a person via modal", async () => {
    render(<AuthUserCardUI entryData={mockAdditionalPeopleData} translations={translations} />);
    test("submits the form and shows confirmation", async () => {
  render(<AuthUserCardUI entryData={mockAdditionalPeopleData} translations={translations} />);
  fireEvent.click(screen.getByRole("button", { name: /add additional person/i }));

  fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Lily" } });
  fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Wong" } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "lily@example.com" } });
  fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: "9876543210" } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: "1985-06-15" } });
  fireEvent.change(screen.getByLabelText(/Address Line 1/i), { target: { value: "123 Main St" } });
  fireEvent.change(screen.getByLabelText(/Address Line 2/i), { target: { value: "Apt 4B" } });
  fireEvent.change(screen.getByLabelText(/Zip Code/i), { target: { value: "90210" } });
  fireEvent.change(screen.getByLabelText(/Membership Number/i), { target: { value: "11223344" } });

  fireEvent.click(screen.getByRole("button", { name: /add additional person/i }));

  await waitFor(() => {
    expect(screen.getByText("Lily Wong")).toBeInTheDocument();
  });
});


    await waitFor(() => {
      fireEvent.click(screen.getByTestId("remove-person-0"));
    });

    await waitFor(() => {
      fireEvent.click(screen.getByRole("button", { name: /Remove/i }));
      expect(screen.queryByText("Lily Wong")).not.toBeInTheDocument();
    });
  });
});

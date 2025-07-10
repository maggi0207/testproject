it("removes person when confirm button in modal is clicked", async () => {
  render(<AuthUserCardUI entryData={mockEntryData} translations={translations} />);

  fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));
  fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Jane" } });
  fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText("Membership Number"), { target: { value: "12345678" } });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Remove"));

  const removeBtn = await screen.findByRole("button", { name: "Remove Person" });
  fireEvent.click(removeBtn);

  await waitFor(() => {
    expect(screen.getByText("Jane Doe has been removed.")).toBeInTheDocument();
  });

  expect(screen.getByRole("button", { name: /add account manager/i })).toBeInTheDocument();
});

it("closes modal when Cancel button is clicked", async () => {
  render(<AuthUserCardUI entryData={mockEntryData} translations={translations} />);

  fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));
  fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Jane" } });
  fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText("Membership Number"), { target: { value: "12345678" } });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Remove"));

  const cancelBtn = await screen.findByRole("button", { name: "Cancel" });
  fireEvent.click(cancelBtn);

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  expect(screen.getByText("Jane Doe")).toBeInTheDocument();
});

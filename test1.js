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

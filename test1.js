it("opens modal with empty title and buttons when removePersonFields have empty strings", async () => {
  const entryWithEmptyModalLabels = {
    ...mockEntryData,
    removepersoncomposer: [
      {
        removepersonwrapper: {
          removepersonref: [
            {
              modalTitle: "",
              primarybuttonlabel: "",
              secondarybuttonlabel: "",
              confirmationtext: "Do you want to remove?",
              _content_type_uid: "removeperson",
            },
          ],
        },
      },
    ],
  };

  render(<AuthUserCardUI entryData={entryWithEmptyModalLabels} translations={translations} />);

  fireEvent.click(screen.getByRole("button", { name: /add account manager/i }));
  fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "Jane" } });
  fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
  fireEvent.change(screen.getByLabelText("Membership Number"), {
    target: { value: "12345678" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  await waitFor(() => {
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("Remove"));

  await waitFor(() => {
    expect(screen.getByText("Do you want to remove?")).toBeInTheDocument();
  });

  const modalButtons = screen.getAllByRole("button");
  expect(modalButtons).toHaveLength(2);
  expect(modalButtons[0]).toHaveTextContent(""); // primary button
  expect(modalButtons[1]).toHaveTextContent(""); // secondary button
});

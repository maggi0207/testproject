test('should use default heading "Success" when heading is not provided and type is "success"', () => {
    render(
      <ToastNotification
        open={true}
        handleClose={mockHandleClose}
        message="This is a success message"
        type="success"
      />
    );
    expect(screen.getByText(/Success/i)).toBeTruthy();  // Verifying default heading is "Success"
  });

  test('should use default heading "Failure" when heading is not provided and type is "failure"', () => {
    render(
      <ToastNotification
        open={true}
        handleClose={mockHandleClose}
        message="This is a failure message"
        type="failure"
      />
    );
    expect(screen.getByText(/Failure/i)).toBeTruthy();  // Verifying default heading is "Failure"
  });

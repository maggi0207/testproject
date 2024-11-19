import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastNotification from './ToastNotification';

describe('ToastNotification', () => {
  const mockHandleClose = jest.fn();

  test('should render success notification correctly', () => {
    render(
      <ToastNotification
        open={true}
        handleClose={mockHandleClose}
        message="This is a success message"
        type="success"
        heading="Success"
      />
    );
    expect(screen.getByText(/This is a success message/i)).toBeInTheDocument();
    expect(screen.getByText(/Success/i)).toBeInTheDocument();
    expect(screen.getByText(/Success/i).parentElement).toHaveStyle('background-color: #EFF6EF');
  });

  test('should render failure notification correctly', () => {
    render(
      <ToastNotification
        open={true}
        handleClose={mockHandleClose}
        message="This is a failure message"
        type="failure"
        heading="Failure"
      />
    );
    expect(screen.getByText(/This is a failure message/i)).toBeInTheDocument();
    expect(screen.getByText(/Failure/i)).toBeInTheDocument();
    expect(screen.getByText(/Failure/i).parentElement).toHaveStyle('background-color: #E9F1FF');
  });

  test('should call handleClose when Snackbar is closed', () => {
    render(
      <ToastNotification
        open={true}
        handleClose={mockHandleClose}
        message="This is a message"
        type="success"
        heading="Success"
      />
    );
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('should not render when open is false', () => {
    render(
      <ToastNotification
        open={false}
        handleClose={mockHandleClose}
        message="This is a message"
        type="success"
        heading="Success"
      />
    );
    expect(screen.queryByText(/This is a message/i)).not.toBeInTheDocument();
  });
});

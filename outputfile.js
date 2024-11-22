import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('NavigationBar Component', () => {
  let navigateMock;

  beforeEach(() => {
    navigateMock = jest.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Masthead and navigation items', () => {
    render(<NavigationBar />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Payments Data')).toBeInTheDocument();
    expect(screen.getByText('Payments Execution')).toBeInTheDocument();
  });

  it('should navigate to home when "Home" is clicked', () => {
    render(<NavigationBar />);
    fireEvent.click(screen.getByText('Home'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('should navigate to payments when "Payments Data" is clicked', () => {
    render(<NavigationBar />);
    fireEvent.click(screen.getByText('Payments Data'));
    expect(navigateMock).toHaveBeenCalledWith('/payments');
  });

  it('should navigate to payment executions when "Payments Execution" is clicked', () => {
    render(<NavigationBar />);
    fireEvent.click(screen.getByText('Payments Execution'));
    expect(navigateMock).toHaveBeenCalledWith('/payment-executions');
  });
});

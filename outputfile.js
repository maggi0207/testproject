import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToggleSwitch } from './ToggleSwitch';

describe('ToggleSwitch Component', () => {
  it('renders the toggle switch correctly', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Test Switch" />);
    const toggleSwitch = screen.getByRole('checkbox', { name: /test switch/i });
    expect(toggleSwitch).toBeInTheDocument();
    expect(toggleSwitch).not.toBeChecked();
  });

  it('renders the switch in the "checked" state when the prop is true', () => {
    render(<ToggleSwitch checked={true} onChange={() => {}} label="Checked Switch" />);
    const toggleSwitch = screen.getByRole('checkbox', { name: /checked switch/i });
    expect(toggleSwitch).toBeChecked();
  });

  it('calls the onChange handler when clicked', () => {
    const mockOnChange = jest.fn();
    render(<ToggleSwitch checked={false} onChange={mockOnChange} label="Clickable Switch" />);
    const toggleSwitchContainer = screen.getByRole('button');
    fireEvent.click(toggleSwitchContainer);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays the correct accessibility label', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Accessible Switch" />);
    const toggleSwitch = screen.getByRole('checkbox', { name: /accessible switch/i });
    expect(toggleSwitch).toHaveAttribute('aria-label', 'Accessible Switch');
  });

  it('handles multiple state changes correctly', () => {
    let isChecked = false;
    const mockOnChange = jest.fn(() => {
      isChecked = !isChecked;
    });

    const { rerender } = render(
      <ToggleSwitch checked={isChecked} onChange={mockOnChange} label="Dynamic Switch" />
    );

    const toggleSwitchContainer = screen.getByRole('button');
    fireEvent.click(toggleSwitchContainer);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(isChecked).toBe(true);

    rerender(<ToggleSwitch checked={isChecked} onChange={mockOnChange} label="Dynamic Switch" />);
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});

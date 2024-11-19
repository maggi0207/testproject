import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ToggleSwitch } from './ToggleSwitch';  // Path to the ToggleSwitch component

describe('ToggleSwitch Component', () => {

  test('should render the ToggleSwitch component correctly', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Toggle switch" />);
    const switchElement = screen.getByRole('switch');  // Query by role
    expect(switchElement).toBeInTheDocument();
  });

  test('should call onChange when the switch is clicked', () => {
    const onChangeMock = jest.fn();
    render(<ToggleSwitch checked={false} onChange={onChangeMock} label="Toggle switch" />);
    const switchElement = screen.getByRole('switch');  // Query by role
    fireEvent.click(switchElement);  // Simulate click on the switch
    expect(onChangeMock).toHaveBeenCalledTimes(1);
  });
});

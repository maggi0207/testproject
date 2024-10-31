import React from 'react';
import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import withTheme from './withTheme';

// MockComponent to wrap with HOC
const MockComponent = ({ surface, color, className, children }) => (
  <div data-testid="mock-component" className={className} style={{ backgroundColor: color }}>
    {children}
  </div>
);

MockComponent.propTypes = {
  surface: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

// Wrapped MockComponent with HOC
const ThemedMockComponent = withTheme(MockComponent);

describe('withTheme HOC', () => {
  beforeEach(() => {
    // Reset the window.mfe values before each test
    delete window.mfe;
  });

  test('should render wrapped component with light theme when isDark is false', () => {
    render(<ThemedMockComponent color="#000000" className="light-theme">Light Theme</ThemedMockComponent>);

    const component = screen.getByTestId('mock-component');
    expect(component).toHaveClass('light-theme');
    expect(component).toHaveStyle('background-color: #000000');
    expect(component).toHaveTextContent('Light Theme');
  });

  test('should render wrapped component with dark theme when isDark is true', () => {
    // Set up global values for dark theme
    window.mfe = { scmDeviceMfeEnable: true, isDark: true };

    render(<ThemedMockComponent color="#000000" className="light-theme">Dark Theme</ThemedMockComponent>);

    const component = screen.getByTestId('mock-component');
    expect(component).toHaveClass('dark-theme');
    expect(component).toHaveStyle('background-color: #ffffff');
    expect(component).toHaveTextContent('Dark Theme');
  });

  test('should apply correct class and color when className and color props are provided', () => {
    render(<ThemedMockComponent color="#123456" className="custom-class">Custom Props</ThemedMockComponent>);

    const component = screen.getByTestId('mock-component');
    expect(component).toHaveClass('custom-class');
    expect(component).toHaveStyle('background-color: #123456');
    expect(component).toHaveTextContent('Custom Props');
  });

  test('should pass through additional props', () => {
    const handleOpenChange = jest.fn();
    render(<ThemedMockComponent color="#abcdef" onOpenedChange={handleOpenChange}>Extra Props</ThemedMockComponent>);

    const component = screen.getByTestId('mock-component');
    expect(component).toHaveStyle('background-color: #abcdef');
    expect(component).toHaveTextContent('Extra Props');
  });
});

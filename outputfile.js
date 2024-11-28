import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import YourComponent from './YourComponent'; // Replace with your component path

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Keep other functionalities intact
  useParams: jest.fn(),
}));

test('should mock useParams and verify the component behavior', () => {
  // Mock the return value of useParams
  useParams.mockReturnValue({
    paymntDatasetId: '12345', // Provide the mock parameter
  });

  // Render your component inside MemoryRouter to handle routing context
  const { getByText } = render(
    <MemoryRouter>
      <YourComponent />
    </MemoryRouter>
  );

  // Perform assertions based on the mocked parameter
  expect(getByText('12345')).toBeInTheDocument(); // Replace with your expected behavior
});

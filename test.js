import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { render } from '../../utils/test-utils/renderHelper';
import rootReducer from '../../modules/store/reducer';
import { rootSaga } from '../../modules/store/saga';
import CheckoutInspicio from './CheckoutInspicio';

describe('CheckoutInspicio Agreement Modal Component', () => {
    const mockCloseModalFn = jest.fn();

    beforeEach(() => {
        // Reset the mock function before each test
        mockCloseModalFn.mockReset();
    });

    test('Renders Backup Payment Agreement Data Title', () => {
        render(<CheckoutInspicio closeModal={mockCloseModalFn} />, {
            reducers: rootReducer,
            sagas: rootSaga,
        });

        // Check for the presence of specific text or title that confirms the component is rendered
        expect(screen.getByText('Backup Payment Agreement')).toBeInTheDocument();
    });

    test('Close on Agree & Continue button click', () => {
        render(<CheckoutInspicio closeModal={mockCloseModalFn} />, {
            reducers: rootReducer,
            sagas: rootSaga,
        });

        // Check for the presence of the 'Agree & Continue' button
        const agreeButton = screen.getByRole('button', { name: 'Agree & Continue' });
        expect(agreeButton).toBeInTheDocument();

        // Simulate a click event on the 'Agree & Continue' button
        fireEvent.click(agreeButton);

        // Assert that the mock function was called exactly once
        expect(mockCloseModalFn).toHaveBeenCalledTimes(1);
    });

    test('Displays correct content based on props', () => {
        const props = {
            someProp: 'Some value',
            anotherProp: 'Another value',
        };

        render(<CheckoutInspicio {...props} closeModal={mockCloseModalFn} />, {
            reducers: rootReducer,
            sagas: rootSaga,
        });

        // Check for content that should be present based on props
        expect(screen.getByText(props.someProp)).toBeInTheDocument();
        expect(screen.getByText(props.anotherProp)).toBeInTheDocument();
    });

    test('Displays modal content correctly', () => {
        render(<CheckoutInspicio closeModal={mockCloseModalFn} />, {
            reducers: rootReducer,
            sagas: rootSaga,
        });

        // Assuming there is some modal content or instructions to check
        expect(screen.getByText('Please agree to the terms to continue.')).toBeInTheDocument();
    });

    test('Handles prop changes correctly', () => {
        const { rerender } = render(<CheckoutInspicio closeModal={mockCloseModalFn} />, {
            reducers: rootReducer,
            sagas: rootSaga,
        });

        // Simulate prop change
        rerender(<CheckoutInspicio someNewProp="New Value" closeModal={mockCloseModalFn} />);

        // Check for updated content based on new props
        expect(screen.getByText('New Value')).toBeInTheDocument();
    });

    // Add more test cases as needed to cover additional functionality or edge cases
});

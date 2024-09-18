import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useEffect } from 'react';
import YourComponent from './YourComponent'; // replace with your actual component

jest.mock('./yourReducerFile', () => ({
    updateLongPollReducer: jest.fn(),
}));

describe('YourComponent', () => {
    let mockUpdateLongPollReducer;

    beforeEach(() => {
        mockUpdateLongPollReducer = require('./yourReducerFile').updateLongPollReducer;
        mockUpdateLongPollReducer.mockClear();
    });

    it('should add and remove the receivePoll event listener', () => {
        const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

        // Render the component
        const { unmount } = render(<YourComponent />);

        // Ensure the event listener is added
        expect(addEventListenerSpy).toHaveBeenCalledWith('receivePoll', expect.any(Function));

        // Unmount the component to test cleanup
        unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('receivePoll', expect.any(Function));

        // Clean up spies
        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    it('should handle receivePoll event correctly when status is Success', () => {
        // Mock event data
        const eventData = {
            detail: {
                status: "Success",
                event: 'someEvent',
                payload: 'somePayload'
            }
        };

        // Render the component
        render(<YourComponent />);

        // Fire the custom event
        fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));

        // Assert that the updateLongPollReducer is called with the processed data
        expect(mockUpdateLongPollReducer).toHaveBeenCalledTimes(1);
        // You can also check for the specific argument passed to the reducer
    });

    it('should not call updateLongPollReducer if status is not Success', () => {
        const eventData = {
            detail: {
                status: "Failed",
                event: 'someEvent',
                payload: 'somePayload'
            }
        };

        render(<YourComponent />);

        // Fire the custom event
        fireEvent(document, new CustomEvent('receivePoll', { detail: eventData.detail }));

        // Assert that updateLongPollReducer is not called
        expect(mockUpdateLongPollReducer).not.toHaveBeenCalled();
    });
});

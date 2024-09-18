import { render, fireEvent } from '@testing-library/react';
import YourComponent from './YourComponent'; // replace with your actual component
import { updateLongPollReducer } from './yourReducerFile'; // replace with actual reducer path

// Mocking the functions
jest.mock('./yourReducerFile', () => ({
    updateLongPollReducer: jest.fn(),
}));

jest.mock('./processReceiveDataFile', () => ({
    processReceiveData: jest.fn(),
}));

describe('YourComponent', () => {
    let mockUpdateLongPollReducer;
    let mockProcessReceiveData;

    beforeEach(() => {
        mockUpdateLongPollReducer = require('./yourReducerFile').updateLongPollReducer;
        mockProcessReceiveData = require('./processReceiveDataFile').processReceiveData;
        mockUpdateLongPollReducer.mockClear();
        mockProcessReceiveData.mockClear();
    });

    it('should call updateLongPollReducer when receiveData is truthy', () => {
        // Mock the processReceiveData to return a valid object (truthy value)
        const receiveData = { someKey: 'someValue' }; // Sample truthy object
        mockProcessReceiveData.mockReturnValue(receiveData);

        // Mock event data with status 'Success'
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

        // Assert that updateLongPollReducer is called with the correct argument
        expect(mockProcessReceiveData).toHaveBeenCalledWith(eventData.detail.event, eventData.detail.payload);
        expect(mockUpdateLongPollReducer).toHaveBeenCalledWith(receiveData);
    });

    it('should not call updateLongPollReducer when receiveData is falsy', () => {
        // Mock processReceiveData to return null (falsy value)
        mockProcessReceiveData.mockReturnValue(null);

        // Mock event data with status 'Success'
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

        // Assert that updateLongPollReducer is not called
        expect(mockUpdateLongPollReducer).not.toHaveBeenCalled();
    });
});

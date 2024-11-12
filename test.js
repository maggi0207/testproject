// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Separate initial and current values for each section
    emailPreferences: {
        initial: {
            dailySummary: true,
            instantNotification: false,
        },
        current: {
            dailySummary: true,
            instantNotification: false,
        },
    },
    communicationPreferences: {
        initial: {
            emailNotification: true,
            webNotification: true,
        },
        current: {
            emailNotification: true,
            webNotification: true,
        },
    },
    isModified: false,
};

const handleToggle = (key) => {
    const newValue = !emailPreferences[key];
    
    if (key === 'dailySummary') {
        if (newValue) {
            // Turn on 'dailySummary' and ensure 'instantNotification' is off
            dispatch(updateEmailPreferenceToggle({ key: 'instantNotification', value: false }));
        } else {
            // If turning off 'dailySummary', make sure 'instantNotification' is on
            dispatch(updateEmailPreferenceToggle({ key: 'instantNotification', value: true }));
        }
    } else if (key === 'instantNotification') {
        if (newValue) {
            // Turn on 'instantNotification' and ensure 'dailySummary' is off
            dispatch(updateEmailPreferenceToggle({ key: 'dailySummary', value: false }));
        } else {
            // If turning off 'instantNotification', make sure 'dailySummary' is on
            dispatch(updateEmailPreferenceToggle({ key: 'dailySummary', value: true }));
        }
    }

    // Finally, update the current key with its new value
    dispatch(updateEmailPreferenceToggle({ key, value: newValue }));
};


const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setEmailPreferencesInitialValues: (state, action) => {
            state.emailPreferences.initial = action.payload;
            state.emailPreferences.current = action.payload;
            state.isModified = false;
        },
        setCommunicationPreferencesInitialValues: (state, action) => {
            state.communicationPreferences.initial = action.payload;
            state.communicationPreferences.current = action.payload;
            state.isModified = false;
        },
        updateEmailPreferenceToggle: (state, action) => {
            const { key, value } = action.payload;
            state.emailPreferences.current[key] = value;

            // Mutually exclusive behavior between dailySummary and instantNotification
            if (key === 'dailySummary' && value === true) {
                state.emailPreferences.current.instantNotification = false;
            } else if (key === 'instantNotification' && value === true) {
                state.emailPreferences.current.dailySummary = false;
            }

            state.isModified = checkIfModified(state);
        },
        updateCommunicationPreferenceToggle: (state, action) => {
            const { key, value } = action.payload;
            state.communicationPreferences.current[key] = value;
            state.isModified = checkIfModified(state);
        },
        resetValues: (state) => {
            state.emailPreferences.current = state.emailPreferences.initial;
            state.communicationPreferences.current = state.communicationPreferences.initial;
            state.isModified = false;
        },
    },
});

const checkIfModified = (state) => {
    const emailModified = Object.keys(state.emailPreferences.initial).some(
        (key) => state.emailPreferences.initial[key] !== state.emailPreferences.current[key]
    );
    const communicationModified = Object.keys(state.communicationPreferences.initial).some(
        (key) => state.communicationPreferences.initial[key] !== state.communicationPreferences.current[key]
    );
    return emailModified || communicationModified;
};

export const {
    setEmailPreferencesInitialValues,
    setCommunicationPreferencesInitialValues,
    updateEmailPreferenceToggle,
    updateCommunicationPreferenceToggle,
    resetValues,
} = notificationSlice.actions;

export default notificationSlice.reducer;

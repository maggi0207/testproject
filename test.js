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

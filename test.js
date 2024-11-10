// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    emailPreferences: {
        initial: 'normal', // Set initial to 'normal'
        current: 'normal', // Set current to 'normal'
    },
    communicationPreferences: {
        initial: 'email', // Set initial to 'email'
        current: 'email', // Set current to 'email'
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
            const { value } = action.payload;
            state.emailPreferences.current = value;
            state.isModified = checkIfModified(state);
        },
        updateCommunicationPreferenceToggle: (state, action) => {
            const { value } = action.payload;
            state.communicationPreferences.current = value;
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
    return state.emailPreferences.initial !== state.emailPreferences.current ||
           state.communicationPreferences.initial !== state.communicationPreferences.current;
};

export const {
    setEmailPreferencesInitialValues,
    setCommunicationPreferencesInitialValues,
    updateEmailPreferenceToggle,
    updateCommunicationPreferenceToggle,
    resetValues,
} = notificationSlice.actions;

export default notificationSlice.reducer;

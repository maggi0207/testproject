// notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    initialValues: {
        dailySummary: true,
        instantNotification: false,
        emailNotification: true,
        webNotification: true,
    },
    currentValues: {
        dailySummary: true,
        instantNotification: false,
        emailNotification: true,
        webNotification: true,
    },
    isModified: false, // Track if any toggle has changed
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setInitialValues: (state, action) => {
            state.initialValues = action.payload;
            state.currentValues = action.payload;
            state.isModified = false;
        },
        updateToggleValue: (state, action) => {
            const { key, value } = action.payload;
            state.currentValues[key] = value;
            state.isModified = Object.keys(state.initialValues).some(
                (key) => state.initialValues[key] !== state.currentValues[key]
            );
        },
        resetValues: (state) => {
            state.currentValues = state.initialValues;
            state.isModified = false;
        },
    },
});

export const { setInitialValues, updateToggleValue, resetValues } = notificationSlice.actions;
export default notificationSlice.reducer;

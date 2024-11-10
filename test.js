const checkIfModified = (state) => {
    console.log("Email Preferences - Initial: ", state.emailPreferences.initial);
    console.log("Email Preferences - Current: ", state.emailPreferences.current);
    console.log("Communication Preferences - Initial: ", state.communicationPreferences.initial);
    console.log("Communication Preferences - Current: ", state.communicationPreferences.current);

    return state.emailPreferences.initial !== state.emailPreferences.current ||
           state.communicationPreferences.initial !== state.communicationPreferences.current;
};

const [isCommunicationPreferencesModified, setIsCommunicationPreferencesModified] = useState(false);

const handleToggleChange = (listName) => {
        setToggleStates((prevState) => {
            const newToggleStates = {
                ...prevState,
                [listName]: !prevState[listName],
            };

            // Check if any preference is modified
            const isModified = Object.keys(newToggleStates).some(
                (key) => newToggleStates[key] !== (prevState[key] || false)
            );
            setIsCommunicationPreferencesModified(isModified);

            return newToggleStates;
        });
    };

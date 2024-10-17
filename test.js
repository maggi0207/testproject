// Define handlers for each action
  const actionHandlers = {
    edit: (item) => {
      console.log(`Editing ${item.name}`);
      // Additional logic for edit
    },
    viewDetails: (item) => {
      console.log(`Viewing details of ${item.name}`);
      // Additional logic for viewing details
    },
    delete: (item) => {
      console.log(`Deleting ${item.name}`);
      // Additional logic for delete
    }
  };

  // Handle action based on the value
  const handleSelectedValueChange = (action, item) => {
    const actionHandler = actionHandlers[action];
    if (actionHandler) {
      actionHandler(item);
    }
    setSelectedAction(action);
  };

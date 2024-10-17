// Handle different actions when `selectedValueChange` event occurs
  const handleSelectedValueChange = (action, item) => {
    switch (action) {
      case 'edit':
        console.log(`Editing ${item.name}`);
        break;
      case 'viewDetails':
        console.log(`Viewing details of ${item.name}`);
        break;
      case 'delete':
        console.log(`Deleting ${item.name}`);
        break;
      default:
        console.log(`Unknown action for ${item.name}`);
    }
    setSelectedAction(action);
  };

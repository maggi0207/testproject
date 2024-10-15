
// Calculate the number of selected options
    const selectedCount = sortedObjectData.reduce(
      (count, [key]) => (selectedCategory.includes(key) ? count + 1 : count),
      0
    );

    // Set the display text
    const displayText =
      selectedCount === 0
        ? 'Select One'
        : `${selectedCount} option${selectedCount > 1 ? 's' : ''} selected`;

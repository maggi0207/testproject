const processAndCaptureFilters = (event) => {
    let filters = {}; 

    selectedCategory.forEach(item => {
        let label = tagTitle[item]; 

        tagValues.forEach(tag => {
            const [categoryName, tags] = Object.entries(tag)[0]; // Extract category name and tags

            // If the selected category matches any tag key, segregate accordingly
            if (tags.hasOwnProperty(item)) {
                // Initialize the filter array for this category if it doesn't exist
                if (!filters[categoryName]) {
                    filters[categoryName] = [];
                }

                // Push the label to the correct filter array
                filters[categoryName].push(label);
            }
        });
    });

    // Create the event object with all categorized filters
    const eventData = {
        event: event,
        SearchTerm: Object.entries(filters).map(([category, values]) => {
            return values.join(','); // Join the values for each category with a comma
        }).join(' | ') // Join categories with a pipe operator
    };

    // Pass the event object to the capturing function
    dataLayerLearningFiltersCapturingEvent(eventData);
};

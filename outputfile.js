export const dataLayerLearningFiltersCapturingEvent = (eventData) => {
    window?.digitalData?.events?.push(eventData);
};

export const processAndCaptureFilters = (event, selectedCategory, tagTitle, selectedFilteredData) => {
    // Initialize the filter arrays for each category
    let activeFilters = [];
    let selectedContentTypeFilters = [];
    let selectedCustomerTypeFilters = [];
    let selectedProductFilters = [];

    // Process selectedCategory and segregate based on category type
    selectedCategory.forEach(item => {
        const [prefix, subItem] = item.split(':');

        let label = tagTitle[item]; // Get label from tagTitle
        let value = item;           // Original value as is

        // Category-based segregation
        if (prefix === "ecc-hub:document-type") {
            selectedContentTypeFilters.push({ label, value });
        } else if (prefix === "ecc-hub:customer-type") {
            selectedCustomerTypeFilters.push({ label, value });
        } else if (prefix === "ecc-hub:products") {
            selectedProductFilters.push({ label, value });
        }
    });

    // Process selectedFilteredData to populate ActiveFilters with title and url
    selectedFilteredData.forEach(item => {
        const { title, pagePath } = item.relatedContentBean;

        // Push to ActiveFilters as per the required structure
        activeFilters.push({
            title: title,
            url: pagePath
        });
    });

    // Create the event object with all categorized filters
    const eventData = {
        "event": event,
        "ActiveFilters": activeFilters,  // Contains title and URL from selectedFilteredData
        "FiltersArticles": [],           // Additional info can be added if available
        "SelectedContentTypeFilters": selectedContentTypeFilters,
        "SelectedCustomerTypeFilters": selectedCustomerTypeFilters,
        "SelectedProductFilters": selectedProductFilters
    };

    // Pass the event object to the capturing function
    dataLayerLearningFiltersCapturingEvent(eventData);
};


// Process filters and send the object
processAndCaptureFilters("filterApplied", selectedCategory, tagTitle, selectedFilteredData);

 const processAndCaptureFilters = (event, selectedCategory, tagTitle, selectedFilteredData, tagValues) => {
    // Initialize the filter arrays for each category
    let activeFilters = [];
    let selectedContentTypeFilters = [];
    let selectedCustomerTypeFilters = [];
    let selectedProductFilters = [];
    let filteredArticles = []; 
    
    // Map the tagValues to easily access category types and values
    const tagMap = {
        "Content Type": "selectedContentTypeFilters",
        "Customer Type": "selectedCustomerTypeFilters",
        "Product": "selectedProductFilters"
    };

    // Loop through selectedCategory and segregate by category, matching with tagValues
    selectedCategory.forEach(item => {
        let label = tagTitle[item]; // Get label from tagTitle
        let value = item;           // Original value as is

        // Loop through tagValues and compare
        tagValues.forEach(tag => {
            const [categoryName, tags] = Object.entries(tag)[0]; // Extract category name and tags map

            // If the selected category matches any tag key, segregate accordingly
            if (tags.hasOwnProperty(item)) {
                let filterArrayName = tagMap[categoryName];

                // Push the label-value pair to the correct filter array
                if (filterArrayName === "selectedContentTypeFilters") {
                    selectedContentTypeFilters.push({ label, value });
                } else if (filterArrayName === "selectedCustomerTypeFilters") {
                    selectedCustomerTypeFilters.push({ label, value });
                } else if (filterArrayName === "selectedProductFilters") {
                    selectedProductFilters.push({ label, value });
                }

                // Also add it to active filters
                activeFilters.push({ label, value });
            }
        });
    });

    // Process selectedFilteredData to populate FilteredArticles with title and url
    selectedFilteredData.forEach(item => {
        const { title, pagePath } = item.relatedContentBean;

        // Push to FilteredArticles as per the required structure
        filteredArticles.push({
            title: title,
            url: pagePath
        });
    });

    // Create the event object with all categorized filters and filtered articles
    const eventData = {
        "event": event,
        "ActiveFilters": activeFilters,  
        "FilteredArticles": filteredArticles, 
        "SelectedContentTypeFilters": selectedContentTypeFilters,
        "SelectedCustomerTypeFilters": selectedCustomerTypeFilters,
        "SelectedProductFilters": selectedProductFilters
    };

    // Pass the event object to the capturing function
    dataLayerLearningFiltersCapturingEvent(eventData);
};


// Debounced search handler
  const debouncedSearch = debounce((query) => {
    setPage(1); // Reset to first page on new search
    setSearchQuery(query);
  }, 500);

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    debouncedSearch(query);
  };

  // Filter and paginate data
  const filteredData = useMemo(() => {
    const filtered = initialData.filter((item) =>
      item.id.toString().includes(searchQuery)
    );
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filtered.slice(start, end);
  }, [initialData, searchQuery, page]);

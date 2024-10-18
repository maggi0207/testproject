
{
  "pagination": {
    "pageNumber": 1,
    "itemsPerPage": 10,
    "sortBy": "name",  // Change this as needed
    "sortDir": "ASC"  // Change this as needed
  }
}

const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const handleSearch = useCallback(
  debounce((query) => {
    dispatch(fetchData(query));
  }, 500),
  []
);

const onSearchInputChange = (e) => {
  const query = e.target.value;
  setSearchQuery(query);
  handleSearch(query);
};


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from './actions';
import { Table, Toolbar, Paginator } from 'your-component-library'; // Adjust based on your library

const PaginatorTable = () => {
  const dispatch = useDispatch();
  const { data, totalItems } = useSelector((state) => state.dataReducer);
  
  const paginatorContainerRef = React.createRef();
  
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  
  useEffect(() => {
    dispatch(fetchData(page, itemsPerPage));
  }, [page, itemsPerPage, dispatch]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newSize) => {
    setItemsPerPage(newSize);
    setPage(1); // Reset to the first page
  };

  const columns = [
    { key: 'id', label: 'S.No', align: 'left' },
    { key: 'price', label: 'Price', align: 'center' },
    { key: 'lastDate', label: 'Date' },
  ];

  return (
    <>
      <Toolbar aria-label="Table paginator">
        <div ref={paginatorContainerRef} className="wf-u-text-align-right" />
      </Toolbar>

      <Table
        columns={columns}
        data={data}
        rowKey="id"
        paginator={{
          page,
          itemsPerPage,
          totalItems, // Used to determine total pages
          pageSizes: [10, 20, 30, 40, 50],
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleItemsPerPageChange,
          'aria-label': 'Paginator',
          container: paginatorContainerRef,
        }}
      />
    </>
  );
};

export default PaginatorTable;

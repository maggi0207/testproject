import React, { useState } from "react";
import Select from "react-select";
import "./styles.css"; // Import the CSS file

const options = Array.from({ length: 200 }, (_, i) => ({
  value: `Account ${i + 1}`,
  label: `Account ${i + 1} lorem ipsum dolor sit`,
}));

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const AccountSelection = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [tempSelection, setTempSelection] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default 10 items per page

  const handleAdd = () => {
    const newItems = tempSelection.filter(
      (item) => !selectedOptions.some((selected) => selected.value === item.value)
    );

    if (newItems.length > 0) {
      setSelectedOptions([...selectedOptions, ...newItems]);
      setTempSelection([]); // Clear temporary selection
      setCurrentPage(1); // Reset to first page
    }
  };

  const handleRemove = (value) => {
    setSelectedOptions(selectedOptions.filter((item) => item.value !== value));
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === "next"
        ? Math.min(prev + 1, Math.ceil(selectedOptions.length / itemsPerPage))
        : Math.max(prev - 1, 1)
    );
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = selectedOptions.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="container">
      <h3>Search / Select accounts</h3>
      <div className="select-container">
        <Select
          isMulti
          options={options}
          value={tempSelection}
          onChange={setTempSelection}
          className="select-box"
        />
        <button className="add-btn" onClick={handleAdd}>Add</button>
      </div>

      <h4>Assigned accounts</h4>
      <div className="list-container">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item) => (
            <div key={item.value} className="list-item">
              {item.label}
              <button className="remove-btn" onClick={() => handleRemove(item.value)}>
                ×
              </button>
            </div>
          ))
        ) : (
          <p className="empty-text">No accounts selected.</p>
        )}
      </div>

      {selectedOptions.length > 0 && (
        <div className="pagination">
          <div className="items-per-page">
            <label htmlFor="itemsPerPage">Rows per page: </label>
            <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button className="page-btn" disabled={currentPage === 1} onClick={() => handlePageChange("prev")}>
            ◀ Prev
          </button>
          <span className="page-info">
            {startIdx + 1}-{Math.min(startIdx + itemsPerPage, selectedOptions.length)} of {selectedOptions.length}
          </span>
          <button className="page-btn" disabled={currentPage === Math.ceil(selectedOptions.length / itemsPerPage)} onClick={() => handlePageChange("next")}>
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountSelection;

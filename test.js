import React, { useState } from "react";
import { Button, IconButton } from "your-ui-library"; // Import necessary components from your custom library
import MoreVertIcon from "your-ui-library/MoreVertIcon"; // Custom icon

const PaymentsData = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event, item) => {
    setMenuOpen(true);
    setAnchorEl(event.currentTarget); // Store the button position (anchor)
    setSelectedRow(item); // Set the currently selected row
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    setSelectedRow(null);
    setAnchorEl(null); // Reset the anchor
  };

  const handleRun = () => {
    console.log(`Running for: ${selectedRow.name}`);
    handleMenuClose();
  };

  const handleCreateFrom = () => {
    console.log(`Creating from: ${selectedRow.name}`);
    handleMenuClose();
  };

  const handlePurge = () => {
    console.log(`Purging: ${selectedRow.name}`);
    handleMenuClose();
  };

  const columns = [
    // Other columns
    {
      key: "actions",
      label: "Actions",
      emptyValue: (item) => (
        <>
          <IconButton onClick={(e) => handleMenuClick(e, item)}>
            <MoreVertIcon />
          </IconButton>

          {menuOpen && selectedRow === item && (
            <Menu anchorEl={anchorEl} onClose={handleMenuClose}>
              {selectedRow.paymentsCount > 0 && (
                <MenuItem onClick={handleRun}>Run</MenuItem>
              )}
              <MenuItem onClick={handleCreateFrom}>Create From</MenuItem>
              {selectedRow.activeRunId && (
                <MenuItem onClick={handlePurge}>Purge</MenuItem>
              )}
            </Menu>
          )}
        </>
      ),
    },
  ];

  const data = [
    {
      name: "Example Name",
      sourceSystem: "System A",
      dateHarvested: "2024-10-10",
      paymentsCount: 100,
      activeRunId: 45908,
    },
    {
      name: "Another Name",
      sourceSystem: "System B",
      dateHarvested: "2024-10-09",
      paymentsCount: 0,
      activeRunId: null,
    },
    // Other rows...
  ];

  return (
    <div>
      <NavBar />
      <div className="table-container">
        <h2>Payments Collections Catalog</h2>
        <p>Enter text to narrow down rows in the table below:</p>
        <input type="text" placeholder="Search by Collection Name" />

        <Table columns={columns} data={data} rowKey="name" />

        <button>Create New</button>
      </div>
    </div>
  );
};

export default PaymentsData;

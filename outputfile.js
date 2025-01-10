import React, { useState } from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridActionsCellItem,
  GridRowId,
  GridRowModel,
} from "@mui/x-data-grid";
import { Save, Edit, Delete, Close, Add } from "@mui/icons-material";

interface Row {
  id: number;
  header: string;
  direction: string;
  isNew?: boolean;
}

const headers = ["Fund", "Cusip", "Deal Code", "Side", "Category"];
const directions = ["Ascending", "Descending"];

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isAdding, setIsAdding] = useState(false); // Track if a new row is being added

  const handleRowEditStart = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  const handleRowSave = (id: GridRowId) => {
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View },
    }));
    setIsAdding(false); // Allow the "Add" button to appear again
  };

  const handleRowDelete = (id: GridRowId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setIsAdding(false); // Allow the "Add" button to appear if the new row is deleted
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    if (!newRow.header || !newRow.direction) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== newRow.id));
      return null;
    }

    const updatedRow = { ...newRow, isNew: false };
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleRowCancel = (id: GridRowId) => {
    const row = rows.find((row) => row.id === id);

    if (row?.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }

    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
    setIsAdding(false); // Allow the "Add" button to appear again
  };

  const handleAddRow = () => {
    const id = rows.length + 1;
    setRows((prevRows) => [
      ...prevRows,
      {
        id,
        header: "",
        direction: "",
        isNew: true,
      } as Row,
    ]);
    setRowModesModel((prev) => ({
      ...prev,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "header" },
    }));
    setIsAdding(true); // Prevent another "Add" button from showing
  };

  const handleRowEditStop = (params: any) => {
    const { id } = params;
    const row = rows.find((row) => row.id === id);

    // Reset isAdding if the user clicks outside during editing
    if (row?.isNew) {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }

    setIsAdding(false);
  };

  const columns: GridColDef[] = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 150,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (id === -1 && !isAdding) {
          return [
            <GridActionsCellItem
              icon={<Add />}
              label="Add"
              onClick={handleAddRow}
              color="primary"
            />,
          ];
        }

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Save />}
              label="Save"
              onClick={() => handleRowSave(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<Close />}
              label="Cancel"
              onClick={() => handleRowCancel(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleRowEditStart(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleRowDelete(id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "header",
      headerName: "Header",
      width: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: headers,
    },
    {
      field: "direction",
      headerName: "Direction",
      width: 200,
      editable: true,
      type: "singleSelect",
      valueOptions: directions,
    },
  ];

  const displayedRows = isAdding
    ? rows
    : [...rows, { id: -1, header: "", direction: "" }];

  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={displayedRows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={setRowModesModel}
        processRowUpdate={processRowUpdate}
        onRowEditStop={handleRowEditStop}
      />
    </Box>
  );
};

export default App;

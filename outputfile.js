import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PaginatedTable from "./PaginatedTable";
import Loader from "../Loader";

describe("PaginatedTable Component", () => {
  const mockOnPagination = jest.fn();
  const mockColumns = [
    { key: "name", header: "Name" },
    { key: "age", header: "Age" },
  ];
  const mockData = {
    items: [
      { name: "John", age: 30 },
      { name: "Doe", age: 25 },
    ],
    totalItems: 2,
    pageNumber: 1,
    itemsPerPage: 10,
  };

  it("renders the loader when loading is true", () => {
    render(
      <PaginatedTable
        loading={true}
        tableColumns={mockColumns}
        data={mockData}
      />
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders table columns and data", () => {
    render(
      <PaginatedTable
        loading={false}
        tableColumns={mockColumns}
        data={mockData}
        pageNumber={1}
        itemsPerPage={10}
        onPagination={mockOnPagination}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(mockData.items[0]))).toBeInTheDocument();
    expect(screen.getByText(JSON.stringify(mockData.items[1]))).toBeInTheDocument();
  });

  it("calls onPagination when paginator buttons are clicked", () => {
    render(
      <PaginatedTable
        loading={false}
        tableColumns={mockColumns}
        data={mockData}
        pageNumber={1}
        itemsPerPage={10}
        onPagination={mockOnPagination}
      />
    );

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    expect(mockOnPagination).toHaveBeenCalledWith(2);

    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    expect(mockOnPagination).toHaveBeenCalledWith(0);
  });

  it("renders empty table data when loading is true", () => {
    render(
      <PaginatedTable
        loading={true}
        tableColumns={mockColumns}
        data={mockData}
      />
    );

    const tableData = screen.queryByTestId("row-0");
    expect(tableData).not.toBeInTheDocument();
  });
});

1. API Design
Endpoint
GET /api/datasets/last
Returns the latest datasets with their current state/status, and the information needed for rendering the front-end table.
Response Format
json
Copy code
[
  {
    "id": "dataset1",
    "name": "Dataset 1",
    "status": "in_progress", // or "completed", "empty"
    "date_harvested": null, // Null if status is "in_progress"
    "num_payments": null, // Null if status is "in_progress"
    "actions": [] // Dynamic actions list depending on the dataset status
  },
  {
    "id": "dataset2",
    "name": "Dataset 2",
    "status": "completed",
    "date_harvested": "2024-12-08",
    "num_payments": 120,
    "actions": ["view", "edit", "delete"]
  },
  {
    "id": "dataset3",
    "name": "Dataset 3",
    "status": "empty",
    "date_harvested": "2024-12-07",
    "num_payments": 0,
    "actions": ["delete"]
  }
]
Status Definitions
in_progress: Data is being extracted.
Actions: None.
date_harvested and num_payments: Null.
completed: Data extraction is complete.
Actions: Full options (e.g., view, edit, delete).
date_harvested and num_payments: Populated with actual data.
empty: Dataset has zero payments.
Actions: Only "Delete/Purge".
date_harvested: Populated with actual data.
num_payments: 0.
2. Back-End Implementation
API Logic
Fetch the latest datasets: Query the database to retrieve all datasets with their last extracted state.
Determine dataset status:
If the extraction process is incomplete, set the status to in_progress.
If extraction is complete but no payments exist, set the status to empty.
Otherwise, set the status to completed.
Dynamic actions assignment:
Based on the dataset status, generate the allowed actions list.
3. Front-End Design
Table Representation
Name	Status	Date Harvested	Number of Payments	Actions
Dataset 1	In Progress	-	-	(Disabled)
Dataset 2	Completed	2024-12-08	120	View, Edit, Delete
Dataset 3	Empty	2024-12-07	0	Delete
Conditional Formatting
In Progress:

Disable the Actions column entirely.
Highlight the row using a different color or add an iconic status (e.g., spinner or in-progress badge).
Show - for Date Harvested and Number of Payments.
Empty Datasets:

Restrict Actions to "Delete/Purge".
Use a neutral color for the row.
Completed Datasets:

Show all columns with proper data.
Allow full action options.
4. REST API Conformance
Ensure the back-end supports:
Status evaluation logic.
Dynamic actions generation.
Perform tests to verify:
The proper dataset status is returned for various conditions.
Action options comply with the requirements.
5. Sample Code
API Controller (Node.js/Express)
javascript
Copy code
app.get('/api/datasets/last', async (req, res) => {
  const datasets = await fetchDatasetsFromDB(); // Replace with actual DB call
  
  const response = datasets.map(dataset => {
    const isInProgress = !dataset.isExtracted;
    const isEmpty = dataset.numPayments === 0;

    return {
      id: dataset.id,
      name: dataset.name,
      status: isInProgress ? "in_progress" : isEmpty ? "empty" : "completed",
      date_harvested: isInProgress ? null : dataset.dateHarvested,
      num_payments: isInProgress ? null : dataset.numPayments,
      actions: isInProgress
        ? []
        : isEmpty
        ? ["delete"]
        : ["view", "edit", "delete"]
    };
  });

  res.json(response);
});
Front-End (React)
javascript
Copy code
function DatasetTable({ datasets }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Date Harvested</th>
          <th>Number of Payments</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {datasets.map((dataset) => (
          <tr
            key={dataset.id}
            className={
              dataset.status === "in_progress"
                ? "row-in-progress"
                : dataset.status === "empty"
                ? "row-empty"
                : ""
            }
          >
            <td>{dataset.name}</td>
            <td>{dataset.status.replace("_", " ")}</td>
            <td>{dataset.date_harvested || "-"}</td>
            <td>{dataset.num_payments || "-"}</td>
            <td>
              {dataset.actions.length > 0
                ? dataset.actions.map((action) => <button>{action}</button>)
                : "Disabled"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
6. Testing
Test scenarios:
Datasets in progress.
Datasets with zero payments.
Fully extracted datasets.
Verify:
API response formats.
Front-end rendering based on the status.
This ensures all requirements are satisfied for both API and UI.

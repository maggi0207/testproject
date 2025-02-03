.container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

h3, h4 {
  margin-bottom: 10px;
}

.select-container {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.select-box {
  flex: 1;
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn:hover {
  background: #0056b3;
}

.list-container {
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 6px;
  min-height: 120px;
  background: #fafafa;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 5px;
  background: white;
}

.remove-btn {
  background: red;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 2px 8px;
  cursor: pointer;
}

.remove-btn:hover {
  background: darkred;
}

.empty-text {
  color: gray;
  text-align: center;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 5px;
}

.items-per-page select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.page-btn {
  padding: 5px 10px;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
}

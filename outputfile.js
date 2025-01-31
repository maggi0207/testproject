import React, { useState } from "react";
import Select from "react-select";
import "./RegisterUser.css";

const accountsData = Array.from({ length: 200 }, (_, i) => ({ value: `Account ${i + 1}`, label: `Account ${i + 1} lorem ipsum dolar sit` }));

const RegisterUser = () => {
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const totalPages = Math.ceil(accountsData.length / perPage);
  const displayedAccounts = accountsData.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleAddAccount = (selectedOption) => {
    setSelectedAccounts(selectedOption || []);
  };

  const handleRemoveAccount = (account) => {
    setSelectedAccounts(selectedAccounts.filter((item) => item.value !== account.value));
  };

  return (
    <div className="container">
      <h2 className="title">Register new user</h2>
      <p className="description">Complete the form below to register a new user. You will receive confirmation when your case has been processed.</p>
      <div className="form-group">
        <label>Email / User ID *</label>
        <input type="email" className="input" placeholder="john.smith@optum.com" />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>First name *</label>
          <input type="text" className="input" placeholder="John" />
        </div>
        <div className="form-group">
          <label>Last name *</label>
          <input type="text" className="input" placeholder="Smith" />
        </div>
      </div>
      <div className="form-group">
        <h3>User roles</h3>
        <p>Select at least one role.</p>
        <input type="checkbox" /> Standard user
        <input type="checkbox" defaultChecked /> Account case manager
        <input type="checkbox" /> Partner case manager
      </div>
      <div className="form-group">
        <h3>Account access</h3>
        <p>Select at least one account.</p>
        <Select options={accountsData} isMulti onChange={handleAddAccount} className="select" />
      </div>
      <div className="form-group">
        <h4>Assigned accounts</h4>
        <div className="assigned-accounts">
          {selectedAccounts.map((account, index) => (
            <div key={index} className="account-item">
              {account.label}
              <button className="remove-btn" onClick={() => handleRemoveAccount(account)}>X</button>
            </div>
          ))}
        </div>
      </div>
      <div className="pagination-container">
        <label>Rows per page:</label>
        <select onChange={(e) => setPerPage(Number(e.target.value))} defaultValue={20} className="select">
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <div className="pagination-controls">
          <button className="pagination-btn" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button className="pagination-btn" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>Next</button>
        </div>
      </div>
      <div className="button-group">
        <button className="submit-btn">Submit</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default RegisterUser;

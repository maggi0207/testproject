
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'your-button-library'; // Replace with actual import
import Masthead from './Masthead'; // Adjust the import path as necessary
import '../assets/css/buttonContainer.css';  // Button container-specific styles

const ButtonContainer = () => {
  const navigate = useNavigate();

  return (
    <>
      <Masthead />

      <div className="button-container">
        <Button 
          kind={window.location.pathname === '/payments-data' ? 'primary' : 'standard'} 
          className="btn" 
          onClick={() => navigate('/payments-data')}
        >
          Payments Data
        </Button>

        <Button 
          kind={window.location.pathname === '/payments-execution' ? 'primary' : 'standard'} 
          className="btn" 
          onClick={() => navigate('/payments-execution')}
        >
          Payments Execution
        </Button>
      </div>
    </>
  );
};

export default ButtonContainer;


import React from 'react';
import NavBar from './NavBar';
import { Table, Button } from 'wfia'; // Importing Table and Button from the WFIA package
import '../assets/css/paymentsData.css';  // Importing the specific CSS for PaymentsData

const PaymentsData = () => {
  // Define columns for the table
  const columns = [
    {
      key: "name",
      label: "Name",
      align: "left", // Align left
    },
    {
      key: "sourceSystem",
      label: "Source System",
      align: "left", // Align left
    },
    {
      key: "dateHarvested",
      label: "Date Harvested",
      align: "left", // Align left
    },
    {
      key: "paymentsCount",
      label: "# Payments",
      align: "left", // Align left
    },
    {
      key: "triggerRun",
      label: "Trigger Run",
      emptyValue: () => (
        <Button kind="standard" slim>
          Run
        </Button>
      ),
    },
    {
      key: "createNewFrom",
      label: "Create New From",
      emptyValue: () => (
        <Button kind="standard" slim>
          Create From
        </Button>
      ),
    },
    {
      key: "activeRunId",
      label: "Active Run ID",
      align: "left", // Align left
    },
    {
      key: "delete",
      label: "Delete",
      emptyValue: () => (
        <Button kind="standard" slim>
          Purge
        </Button>
      ),
    },
  ];

  // Sample data for the table
  const data = [
    {
      name: "Example Name",
      sourceSystem: "System A",
      dateHarvested: "2024-10-10",
      paymentsCount: 100,
      activeRunId: 45908,
    },
    // Add more sample data as needed
  ];

  return (
    <div>
      <NavBar />
      <div className="table-container">
        <h2>Payments Collections Catalog</h2>
        <p>Enter text to narrow down rows in the table below:</p>
        <input type="text" placeholder="Search by Collection Name" />

        <Table
          columns={columns}
          data={data}
          rowKey="name"
        />

        <button>Create New</button>
      </div>
    </div>
  );
};

export default PaymentsData;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/buttonContainer.css';  // Button container-specific styles

const ButtonContainer = () => {
  const navigate = useNavigate();

  return (
    <div className="button-container">
      <button className="btn" onClick={() => navigate('/payments-data')}>
        Payments Data
      </button>
      <button className="btn" onClick={() => navigate('/payments-execution')}>
        Payments Execution
      </button>
    </div>
  );
};

export default ButtonContainer;

/* src/assets/css/buttonContainer.css */

.button-container {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.btn {
  background-color: #4287f5;
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}

.btn:hover {
  background-color: #1d5bbf;
}




import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PaymentsData from './components/PaymentsData';
import PaymentsExecution from './components/PaymentsExecution';
import './assets/css/app.css';  // You can add global styles if necessary

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/payments-data" element={<PaymentsData />} />
        <Route path="/payments-execution" element={<PaymentsExecution />} />
      </Routes>
    </Router>
  );
};

export default App;

//NavBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/navBar.css';  // Importing the specific CSS for NavBar

const NavBar = () => {
  const location = useLocation();

  return (
    <nav>
      <Link to="/payments-data">
        <button className={location.pathname === '/payments-data' ? 'active' : ''}>
          Payments Data
        </button>
      </Link>

      <Link to="/payments-execution">
        <button className={location.pathname === '/payments-execution' ? 'active' : ''}>
          Payments Execution
        </button>
      </Link>
    </nav>
  );
};

export default NavBar;

/* src/assets/css/navBar.css */

nav {
  text-align: center;
  margin: 20px 0;
}

button {
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

button.active {
  background-color: red;
}



//Home.jsx

import React from 'react';
import NavBar from './NavBar';
import '../assets/css/home.css';  

const Home = () => {
  return (
    <div>
      <NavBar />
      <div className="welcome-container">
        <h2>Welcome to UAT/PRODUCTION - PARALLEL</h2>
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Home;

/* src/assets/css/home.css */

h2 {
  text-align: center;
}

p {
  text-align: center;
}

div.welcome-container {
  text-align: center;
  margin-top: 50px;
}


import React from 'react';
import NavBar from './NavBar';
import '../assets/css/paymentsData.css';  // Importing the specific CSS for PaymentsData

const PaymentsData = () => {
  return (
    <div>
      <NavBar />
      <div className="table-container">
        <h2>Payments Collections Catalog</h2>
        <p>Enter text to narrow down rows in the table below:</p>
        <input type="text" placeholder="Search by Collection Name" />

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Source System</th>
              <th>Date Harvested</th>
              <th># Payments</th>
              <th>Trigger Run</th>
              <th>Create New From</th>
              <th>Active Run ID</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Example Name</td>
              <td>System A</td>
              <td>2024-10-10</td>
              <td>100</td>
              <td><button>Run</button></td>
              <td><button>Create From</button></td>
              <td>45908</td>
              <td><button>Purge</button></td>
            </tr>
          </tbody>
        </table>

        <button>Create New</button>
      </div>
    </div>
  );
};

export default PaymentsData;

/* src/assets/css/paymentsData.css */

div.table-container {
  padding: 20px;
}

table {
  width: 100%;
  text-align: center;
  border-collapse: collapse;
}

table, th, td {
  border: 1px solid #ccc;
}

th, td {
  padding: 10px;
}

input {
  padding: 5px;
  margin: 10px 0;
}

button {
  padding: 5px 10px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}



import React from 'react';
import NavBar from './NavBar';
import '../assets/css/paymentsExecution.css';  // Importing the specific CSS for PaymentsExecution

const PaymentsExecution = () => {
  return (
    <div>
      <NavBar />
      <div className="execution-container">
        <h2>Payments Execution Page</h2>
        <p>Execution-related content goes here...</p>
      </div>
    </div>
  );
};

export default PaymentsExecution;

/* src/assets/css/paymentsExecution.css */

div.execution-container {
  padding: 20px;
}

h2 {
  text-align: center;
}

p {
  text-align: center;
}





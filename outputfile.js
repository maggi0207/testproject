import React, { useEffect } from 'react';
import './Toast.css'; // Import the CSS file

const Toast = ({ runId, duration = 4000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // Clear the timeout on unmount
  }, [duration, onClose]);

  return (
    <div className={`toast-container show`} role="alert">
      <div className="toast-feedback">
        Your request was submitted. Run Id: {runId}
      </div>
    </div>
  );
};

export default Toast;

/* Toast.css */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.toast-container.show {
  opacity: 1;
  transform: translateY(0);
}

.toast-feedback {
  background-color: #d9edf7; /* Informational theme */
  border: 1px solid #bce8f1; /* Light blue border */
  color: #31708f; /* Text color */
  padding: 15px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}


import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Toast from './Toast'; // Import your Toast component

const YourComponent = () => {
  const runId = useSelector((state) => state.testRun.runId);
  const [showToast, setShowToast] = useState(false);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  React.useEffect(() => {
    if (runId) {
      setShowToast(true);
    }
  }, [runId]);

  return (
    <div>
      {/* Other component content */}
      {showToast && <Toast runId={runId} onClose={handleCloseToast} />}
    </div>
  );
};

export default YourComponent;

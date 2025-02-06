import React, { useState } from "react";
import Modal from "./Modal";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4">
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        header="Are you sure you want to cancel?"
        content="Canceling now will discard the information you've entered and stop the case from being created."
        buttons={[
          { label: "Continue editing", onClick: () => setIsOpen(false), primary: false },
          { label: "Cancel and do not save", onClick: () => console.log("Canceled"), primary: true },
        ]}
      />
    </div>
  );
};

export default App;

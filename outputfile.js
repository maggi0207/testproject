import React from "react";
import { Modal, Button } from "@mui/material";
import "./RegisterUserModal.scss";

const RegisterUserModal = ({ isOpen, onClose, header, content, buttons }) => {
  return (
    <Modal open={isOpen} onClose={onClose} className="modal-container">
      <div className="modal-content">
        <h2 className="modal-header">{header}</h2>

        <p className="modal-body">{content}</p>

        <div className="modal-footer">
          {buttons?.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              variant={button.primary ? "contained" : "outlined"}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default RegisterUserModal;

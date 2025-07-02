// components/SubComponents/RemovePersonModal.tsx

import React from 'react';
import { Modal, Text } from '@costcolabs/forge-components';

interface RemovePersonModalProps {
  isOpen: boolean;
  firstName: string;
  lastName: string;
  onClose: () => void;
  onRemove: () => void;
}

const RemovePersonModal: React.FC<RemovePersonModalProps> = ({
  isOpen,
  firstName,
  lastName,
  onClose,
  onRemove,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      modalTitle="Remove Person"
      onClose={onClose}
      buttons={[
        {
          text: 'Remove Person',
          action: onRemove,
        },
        {
          text: 'Cancel',
          action: onClose,
        },
      ]}
    >
      <Text>
        Are you sure you want to remove {firstName} {lastName} from your membership?
      </Text>
    </Modal>
  );
};

export default RemovePersonModal;


import React, { useState } from 'react';
import RemovePersonModal from './components/SubComponents/RemovePersonModal';

const ParentComponent = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleRemove = () => {
    console.log('Person removed');
    setModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>

      <RemovePersonModal
        isOpen={isModalOpen}
        firstName="John"
        lastName="Doe"
        onClose={() => setModalOpen(false)}
        onRemove={handleRemove}
      />
    </>
  );
};

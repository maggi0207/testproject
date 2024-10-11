import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPayments, createNewPayment, updatePayment } from '../slices/paymentsSlice'; // Import updatePayment
import NavBar from './NavBar';
import Table from './Table';
import { Button, ModalSelect, Spinner, Notification } from 'your-ui-library';
import CreateNewCollectionForm from './CreateNewCollectionForm';

const PaymentsData = () => {
  const dispatch = useDispatch();
  const { paymentsData, loading, error } = useSelector((state) => state.payments);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getPayments());
  }, [dispatch]);

  const handleClick = () => {
    setFormData(null); // Clear form data for creating a new payment
    setOpen(true); // Open modal
  };

  const handleCreateFrom = (item) => {
    setFormData(item); // Set form data for editing
    setOpen(true); // Open modal
  };

  const handleClose = () => {
    setOpen(false); // Close modal
  };

  const handleSave = (newData) => {
    if (formData) {
      // If formData exists, update the existing payment
      dispatch(updatePayment({ ...formData, ...newData })); // Dispatch action to update payment
    } else {
      // Otherwise, create a new payment
      dispatch(createNewPayment(newData)); // Dispatch action to create a new payment
    }
    setOpen(false); // Close modal
  };

  const columns = useMemo(() => [
    { key: 'name', label: 'Name', align: 'center' },
    { key: 'sourceSystem', label: 'Source System', align: 'center' },
    { key: 'dateHarvested', label: 'Date Harvested', align: 'center' },
    { key: 'paymentsCount', label: '# Payments', align: 'center' },
    {
      key: 'createNewFrom',
      label: 'Create New From',
      emptyValue: (item) => (
        <Button kind="standard" slim onClick={() => handleCreateFrom(item)}>
          Create From
        </Button>
      ),
    },
  ], []);

  const filteredData = paymentsData.filter(payment =>
    payment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Spinner size="large" />; // Show spinner during loading
  if (error) return <Notification type="error" message={error} />; // Show error notification

  return (
    <div>
      <NavBar />
      <div className="table-container">
        <h2>Payments Collections Catalog</h2>
        <p>Enter text to narrow down rows in the table below:</p>
        <input
          type="text"
          placeholder="Search by Collection Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table
          columns={columns}
          data={filteredData}
          rowKey="name"
        />
        <Button onClick={handleClick}>Create New</Button>
        <ModalSelect
          name="modalSelectCreateNew"
          label="Create New Collection"
          open={open}
          onClose={handleClose}
          trigger={null} // Set this if you want to have a specific trigger button
          elementToFocusOnClose="#createNewButton" // ID of the element to focus when closing
        >
          <CreateNewCollectionForm
            initialData={formData} // Pass initial data to form
            onClose={handleClose} // Close modal on form submission or cancellation
            onSave={handleSave} // Function to save the new payment or update existing payment
          />
        </ModalSelect>
      </div>
    </div>
  );
};

export default PaymentsData;


import React, { useEffect, useState } from 'react';
import {
  Button,
  Panel,
  Flexgrid,
  FlexgridItem,
  Form,
  Container,
  TextInput,
  Select,
  MenuItem,
  DatePicker,
} from 'your-internal-library'; // Adjust this import based on your actual library

const CreateNewCollectionForm = ({ onClose, initialData = {}, onSave }) => {
  const [collectionName, setCollectionName] = useState(initialData.collectionName || '');
  const [paymentSource, setPaymentSource] = useState(initialData.paymentSource || '');
  const [startDate, setStartDate] = useState(initialData.startDate || null);
  const [endDate, setEndDate] = useState(initialData.endDate || null);
  const [incomingFormat, setIncomingFormat] = useState(initialData.incomingFormat || '');
  const [outgoingFormat, setOutgoingFormat] = useState(initialData.outgoingFormat || '');
  const [optionalCriteria, setOptionalCriteria] = useState(initialData.optionalCriteria || '');

  useEffect(() => {
    // Prefill the form if initialData is provided
    if (initialData) {
      setCollectionName(initialData.collectionName || '');
      setPaymentSource(initialData.paymentSource || '');
      setStartDate(initialData.startDate || null);
      setEndDate(initialData.endDate || null);
      setIncomingFormat(initialData.incomingFormat || '');
      setOutgoingFormat(initialData.outgoingFormat || '');
      setOptionalCriteria(initialData.optionalCriteria || '');
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Construct the new data object
    const newData = {
      collectionName,
      paymentSource,
      startDate,
      endDate,
      incomingFormat,
      outgoingFormat,
      optionalCriteria,
    };
    // Call the onSave function with the new data
    onSave(newData);
    // Close the form
    onClose();
  };

  return (
    <Panel fullScreen onClose={onClose} title={initialData.collectionName ? "Edit Collection" : "Create New Collection"}>
      <Form onSubmit={handleSubmit}>
        <Container>
          <Flexgrid>
            <FlexgridItem>
              <TextInput
                required
                label="Collection Name"
                name="collectionName"
                value={collectionName}
                onValueChange={(value) => setCollectionName(value)}
              />
            </FlexgridItem>
            <FlexgridItem>
              <Select
                required
                label="Payment Source"
                name="paymentSource"
                value={paymentSource}
                onValueChange={(value) => setPaymentSource(value)}
              >
                <MenuItem value="EPODS-SIT">EPODS-SIT</MenuItem>
                <MenuItem value="EPODS-UAT">EPODS-UAT</MenuItem>
                <MenuItem value="File Upload">File Upload</MenuItem>
              </Select>
            </FlexgridItem>
            <FlexgridItem>
              <DatePicker
                required
                label="Start Date"
                name="startDate"
                value={startDate}
                onValueChange={(date) => setStartDate(date)}
              />
            </FlexgridItem>
            <FlexgridItem>
              <DatePicker
                required
                label="End Date"
                name="endDate"
                value={endDate}
                onValueChange={(date) => setEndDate(date)}
              />
            </FlexgridItem>
            <FlexgridItem>
              <Select
                label="Incoming Payment Format"
                name="incomingFormat"
                value={incomingFormat}
                onValueChange={(value) => setIncomingFormat(value)}
              >
                <MenuItem value="FED">FED</MenuItem>
                <MenuItem value="CHIPS">CHIPS</MenuItem>
                <MenuItem value="SWIFT">SWIFT</MenuItem>
                <MenuItem value="IBT">IBT</MenuItem>
              </Select>
            </FlexgridItem>
            <FlexgridItem>
              <Select
                label="Outgoing Payment Format"
                name="outgoingFormat"
                value={outgoingFormat}
                onValueChange={(value) => setOutgoingFormat(value)}
              >
                <MenuItem value="FED">FED</MenuItem>
                <MenuItem value="CHIPS">CHIPS</MenuItem>
                <MenuItem value="SWIFT">SWIFT</MenuItem>
                <MenuItem value="IBT">IBT</MenuItem>
              </Select>
            </FlexgridItem>
            <FlexgridItem>
              <TextInput
                label="Optional Criteria"
                name="optionalCriteria"
                value={optionalCriteria}
                onValueChange={(value) => setOptionalCriteria(value)}
              />
            </FlexgridItem>
          </Flexgrid>
        </Container>
        <Button type="submit">{initialData.collectionName ? 'Update' : 'Create'}</Button>
      </Form>
    </Panel>
  );
};

export default CreateNewCollectionForm;

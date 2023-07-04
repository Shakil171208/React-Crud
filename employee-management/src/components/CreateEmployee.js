import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

const CreateEmployee = () => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [showNameAlert, setShowNameAlert] = useState(false);
  const [showDesignationAlert, setShowDesignationAlert] = useState(false);

  const handleCreate = async () => {
    const isNameEmpty = name.trim() === '';
    const isDesignationEmpty = designation.trim() === '';

    if (isNameEmpty && isDesignationEmpty) {
      setShowNameAlert(true);
      setShowDesignationAlert(true);
      return;
    }

    if (isNameEmpty) {
      setShowNameAlert(true);
      return;
    }

    if (isDesignationEmpty) {
      setShowDesignationAlert(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, designation }),
      });
      if (response.ok) {
        console.log('Employee created successfully!');
        setName('');
        setDesignation('');
        setShowNameAlert(false);
        setShowDesignationAlert(false);
      }
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  return (
    <div className="container">
      <h2>Add Employee</h2>
      {showNameAlert && (
        <Alert variant="danger" onClose={() => setShowNameAlert(false)} dismissible>
          Please enter a valid name.
        </Alert>
      )}
      {showDesignationAlert && (
        <Alert variant="danger" onClose={() => setShowDesignationAlert(false)} dismissible>
          Please enter a valid designation.
        </Alert>
      )}
      <Form>
        <Form.Group controlId="formName">
          <Form.Control
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDesignation">
          <Form.Control
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleCreate} className="mt-2">
          Add
        </Button>
      </Form>
    </div>
  );
};

export default CreateEmployee;

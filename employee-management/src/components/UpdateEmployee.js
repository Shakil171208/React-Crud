import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const UpdateEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDesignation, setUpdatedDesignation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/employees');
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/employees/${selectedEmployeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: updatedName,
            designation: updatedDesignation,
          }),
        }
      );
      if (response.ok) {
        console.log('Employee updated successfully!');
        setSelectedEmployeeId('');
        setUpdatedName('');
        setUpdatedDesignation('');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div>
      <h2>Update Employee</h2>
      <Form>
        <Form.Select
          value={selectedEmployeeId}
          onChange={(e) => setSelectedEmployeeId(e.target.value)}
        >
          <option value="">Select an employee</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="Updated Name"
          value={updatedName}
          onChange={(e) => setUpdatedName(e.target.value)}
        />
        <Form.Control
          type="text"
          placeholder="Updated Designation"
          value={updatedDesignation}
          onChange={(e) => setUpdatedDesignation(e.target.value)}
        />
        <Button variant="primary" onClick={handleUpdate}>Update</Button>
      </Form>
    </div>
  );
};

export default UpdateEmployee;

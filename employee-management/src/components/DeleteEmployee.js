import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const DeleteEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

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

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/employees/${selectedEmployeeId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        console.log('Employee deleted successfully!');
        setSelectedEmployeeId('');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div>
      <h2>Delete Employee</h2>
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
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </Form>
    </div>
  );
};

export default DeleteEmployee;

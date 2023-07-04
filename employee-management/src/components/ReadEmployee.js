import React, { useState, useEffect } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";

const ReadEmployee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedDesignation, setUpdatedDesignation] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchDesignation, setSearchDesignation] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchName === "" && searchDesignation === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchName.toLowerCase()) ||
          employee.designation
            .toLowerCase()
            .includes(searchDesignation.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [employees, searchName, searchDesignation]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/employees/${selectedEmployee.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedName,
            designation: updatedDesignation,
          }),
        }
      );
      if (response.ok) {
        console.log("Employee updated successfully!");
        const updatedEmployees = employees.map((employee) => {
          if (employee.id === selectedEmployee.id) {
            return {
              ...employee,
              name: updatedName,
              designation: updatedDesignation,
            };
          }
          return employee;
        });
        setEmployees(updatedEmployees);
        setSelectedEmployee(null);
        setUpdatedName("");
        setUpdatedDesignation("");
        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/employees/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log("Employee deleted successfully!");
        if (selectedEmployees.includes(id)) {
          const updatedSelectedEmployees = selectedEmployees.filter(
            (employeeId) => employeeId !== id
          );
          setSelectedEmployees(updatedSelectedEmployees);
        }
        const updatedEmployees = employees.filter(
          (employee) => employee.id !== id
        );
        setEmployees(updatedEmployees);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const openUpdateModal = (employee) => {
    setSelectedEmployee(employee);
    setUpdatedName(employee.name);
    setUpdatedDesignation(employee.designation);
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setSelectedEmployee(null);
    setUpdatedName("");
    setUpdatedDesignation("");
    setShowUpdateModal(false);
  };

  const handleSearch = () => {
    const filtered = employees.filter((employee) => {
      const nameMatch =
        employee.name.toLowerCase().includes(searchName.toLowerCase()) ||
        searchName === "";
      const designationMatch =
        employee.designation
          .toLowerCase()
          .includes(searchDesignation.toLowerCase()) ||
        searchDesignation === "";
      return nameMatch && designationMatch;
    });
    setFilteredEmployees(filtered);
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/employees/batchDelete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: selectedEmployees,
          }),
        }
      );
      if (response.ok) {
        console.log("Employees deleted successfully!");
        const updatedEmployees = employees.filter(
          (employee) => !selectedEmployees.includes(employee.id)
        );
        setEmployees(updatedEmployees);
        setSelectedEmployees([]);

        const totalPages = Math.ceil(updatedEmployees.length / dataPerPage);
        if (pageNumber === totalPages + 1 && totalPages > 0) {
          setPageNumber(totalPages);
        }
      }
    } catch (error) {
      console.error("Error deleting employees:", error);
    }
  };

  // Pagination Variables
  const totalData = filteredEmployees.length;
  const dataPerPage = 3;
  const [pageNumber, setPageNumber] = useState(1);

  const handleClickForPrev = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const handleClickForNext = () => {
    const totalPages = Math.ceil(totalData / dataPerPage);
    if (pageNumber < totalPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handleClickForRandom = (page) => {
    setPageNumber(page);
  };

  // Pagination Logic
  const startIdx = (pageNumber - 1) * dataPerPage;
  const endIdx = startIdx + dataPerPage;
  const displayedEmployees = filteredEmployees.slice(startIdx, endIdx);

  return (
    <div className="container">
      <h2>Employee List</h2>
      <div className="mb-3">
        <div className="d-flex">
          <input
            type="text"
            className="form-control mr-2"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ marginRight: "7px" }}
          />
          <input
            type="text"
            className="form-control mr-2"
            placeholder="Search by Designation"
            value={searchDesignation}
            onChange={(e) => setSearchDesignation(e.target.value)}
            style={{ marginRight: "7px" }}
          />
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <Button
          variant="secondary"
          className="mt-2"
          onClick={() => {
            setSearchName("");
            setSearchDesignation("");
            setFilteredEmployees(employees);
          }}
        >
          Clear
        </Button>
      </div>
      <ListGroup>
        {displayedEmployees.length > 0 ? (
          displayedEmployees.map((employee) => (
            <ListGroup.Item key={employee.id}>
              <div className="d-flex align-items-baseline">
                <div style={{ marginRight: "10px" }}>
                  <Form.Check
                    type="checkbox"
                    className="mr-2 mt-1"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={(e) => {
                      const { checked } = e.target;
                      if (checked) {
                        setSelectedEmployees([
                          ...selectedEmployees,
                          employee.id,
                        ]);
                      } else {
                        const updatedSelectedEmployees =
                          selectedEmployees.filter(
                            (employeeId) => employeeId !== employee.id
                          );
                        setSelectedEmployees(updatedSelectedEmployees);
                      }
                    }}
                  />
                </div>
                <div style={{ flex: "1" }}>
                  <p className="mb-1">Name: {employee.name}</p>
                  <p className="mb-0">Designation: {employee.designation}</p>
                </div>
                <div>
                  <Button
                    variant="primary"
                    className="mr-2"
                    onClick={() => openUpdateModal(employee)}
                    style={{ marginRight: "8px" }}
                  >
                    Update
                  </Button>
                  <Button
                    variant="danger"
                    className="mr-2"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item>No employees found.</ListGroup.Item>
        )}
      </ListGroup>

      {/* Update Employee Modal */}
      <Modal show={showUpdateModal} onHide={closeUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formDesignation">
              <Form.Label>Designation</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter designation"
                value={updatedDesignation}
                onChange={(e) => setUpdatedDesignation(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Selected Button */}
      {selectedEmployees.length > 0 && (
        <div className="mt-2">
          <Button variant="danger" onClick={handleDeleteSelected}>
            Delete Selected
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalData > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pageNumber === 1 ? "disabled" : ""}`}>
            {pageNumber !== 1 && (
              <Button
                variant="link"
                className="page-link"
                onClick={handleClickForPrev}
                style={{ marginRight: "5px" }}
              >
                Previous
              </Button>
            )}
            </li>
            {[...Array(Math.ceil(totalData / dataPerPage)).keys()].map(
              (page) => (
                <li
                  key={page + 1}
                  className={`page-item ${
                    pageNumber === page + 1 ? "active" : ""
                  }`}
                >
                  <Button
                    variant="link"
                    className="page-link"
                    onClick={() => handleClickForRandom(page + 1)}
                    style={{ marginRight: "4px" }}
                  >
                    {page + 1}
                  </Button>
                </li>
              )
            )}
            <li
              className={`page-item ${
                pageNumber === Math.ceil(totalData / dataPerPage)
                  ? "disabled"
                  : ""
              }`}
            >
              {pageNumber !== Math.ceil(totalData / dataPerPage) && (
              <Button
                variant="link"
                className="page-link"
                onClick={handleClickForNext}
                style={{ marginLeft: "1px" }}
              >
                Next
              </Button>
            )}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ReadEmployee;

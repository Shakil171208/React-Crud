import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Nav, Navbar } from 'react-bootstrap';
import CreateEmployee from './components/CreateEmployee';
import ReadEmployee from './components/ReadEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import DeleteEmployee from './components/DeleteEmployee';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar bg="light" expand="lg">
          <Navbar.Brand>Employee Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/">Add Employee</Nav.Link>
              <Nav.Link as={Link} to="/read">Employee List</Nav.Link>
              {/* <Nav.Link as={Link} to="/update">Update Employee</Nav.Link>
              <Nav.Link as={Link} to="/delete">Delete Employee</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
          <Route path="/read" element={<ReadEmployee />} />
          <Route path="/update" element={<UpdateEmployee />} />
          <Route path="/delete" element={<DeleteEmployee />} />
          <Route path="/" element={<CreateEmployee />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

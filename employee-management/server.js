const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Read existing data from db.json
let dbData = [];
fs.readFile("db.json", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading db.json:", err);
  } else {
    dbData = JSON.parse(data);
  }
});

// Get all employees
app.get("/employees", (req, res) => {
  res.json(dbData);
});

// Create a new employee
app.post("/employees", (req, res) => {
  const { name, designation } = req.body;

  // Find the highest existing ID
  const maxId = dbData.reduce((max, emp) => (emp.id > max ? emp.id : max), 0);

  const newEmployee = {
    id: maxId + 1,
    name,
    designation,
  };
  dbData.push(newEmployee);

  // Save updated data to db.json
  fs.writeFile("db.json", JSON.stringify(dbData), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      res.status(500).json({ error: "Failed to save employee data" });
    } else {
      res.status(201).json(newEmployee);
    }
  });
});

// Update an employee
app.put("/employees/:id", (req, res) => {
  const { id } = req.params;
  const { name, designation } = req.body;
  const employee = dbData.find((emp) => emp.id === parseInt(id));
  if (!employee) {
    res.status(404).json({ error: "Employee not found" });
    return;
  }
  employee.name = name;
  employee.designation = designation;

  // Save updated data to db.json
  fs.writeFile("db.json", JSON.stringify(dbData), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      res.status(500).json({ error: "Failed to update employee data" });
    } else {
      res.json(employee);
    }
  });
});

// Delete an employee
app.delete("/employees/:id", (req, res) => {
  const { id } = req.params;
  const index = dbData.findIndex((emp) => emp.id === parseInt(id));
  if (index === -1) {
    res.status(404).json({ error: "Employee not found" });
    return;
  }
  dbData.splice(index, 1);

  // Save updated data to db.json
  fs.writeFile("db.json", JSON.stringify(dbData), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      res.status(500).json({ error: "Failed to delete employee data" });
    } else {
      res.sendStatus(204);
    }
  });
});

// Batch delete employees
app.post("/employees/batchDelete", (req, res) => {
  const { ids } = req.body;
  dbData = dbData.filter((emp) => !ids.includes(emp.id));

  // Save updated data to db.json
  fs.writeFile("db.json", JSON.stringify(dbData), (err) => {
    if (err) {
      console.error("Error writing to db.json:", err);
      res.status(500).json({ error: "Failed to delete employees data" });
    } else {
      res.sendStatus(204);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express"); 
const cors = require("cors"); 
const employees = require("./employees.json"); 
 
const app = express(); 
 
const PORT = process.env.PORT || 5000; 
const APP_NAME = 
  process.env.APP_NAME || "Employee Management API"; 
const APP_ENV = 
  process.env.APP_ENV || "development"; 
 
app.use(cors()); 
app.use(express.json()); 
 
app.get("/", (req, res) => { 
  res.json({ 
    message: `${APP_NAME} is running`, 
    environment: APP_ENV 
  }); 
}); 
 
app.get("/health", (req, res) => { 
  res.status(200).json({ 
    status: "healthy", 
    service: "employee-backend", 
    environment: APP_ENV 
  }); 
}); 
 
app.get("/api/employees", (req, res) => { 
  const { search, department } = req.query; 
 
  let result = employees; 
 
  if (search) { 
    const searchValue = search.toLowerCase(); 
 
    result = result.filter((employee) => { 
      return ( 
        employee.name.toLowerCase().includes(searchValue) || 
        employee.role.toLowerCase().includes(searchValue) || 
        employee.email.toLowerCase().includes(searchValue) 
      ); 
    }); 
  } 
 
  if (department && department !== "All") { 
    result = result.filter( 
      (employee) => employee.department === department 
    ); 
  } 
 
  res.status(200).json(result); 
}); 
 
app.get("/api/employees/:id", (req, res) => { 
  const employeeId = Number(req.params.id); 
 
  const employee = employees.find( 
    (item) => item.id === employeeId 
  ); 
 
  if (!employee) { 
    return res.status(404).json({ 
      message: "Employee not found" 
    }); 
  } 
 
  res.status(200).json(employee); 
}); 
 
app.get("/api/departments", (req, res) => { 
  const departments = [ 
    "All", 
    ...new Set(employees.map((employee) => employee.department)) 
  ]; 
 
  res.status(200).json(departments); 
}); 
 
app.use((req, res) => { 
  res.status(404).json({ 
    message: "Route not found" 
  }); 
}); 
 
app.listen(PORT, "0.0.0.0", () => { 
console.log(`${APP_NAME} started`); 
console.log(`Environment: ${APP_ENV}`); 
console.log(`Listening on port: ${PORT}`); 
});
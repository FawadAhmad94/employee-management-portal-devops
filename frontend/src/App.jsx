import React, { useEffect, useMemo, useState } from "react"; 
const API_URL = 
import.meta.env.VITE_API_URL || 
"http://localhost:5000"; 
function App() { 
const [employees, setEmployees] = useState([]); 
const [search, setSearch] = useState(""); 
const [department, setDepartment] = useState("All"); 
const [departments, setDepartments] = useState(["All"]); 
const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
 
  useEffect(() => { 
    loadDepartments(); 
  }, []); 
 
  useEffect(() => { 
    loadEmployees(); 
  }, [search, department]); 
 
  async function loadDepartments() { 
    try { 
      const response = await fetch( 
        `${API_URL}/api/departments` 
      ); 
 
      if (!response.ok) { 
        throw new Error("Unable to load departments"); 
      } 
 
      const data = await response.json(); 
      setDepartments(data); 
    } catch (err) { 
      setError(err.message); 
    } 
  } 
 
  async function loadEmployees() { 
    try { 
      setLoading(true); 
      setError(""); 
 
      const params = new URLSearchParams(); 
 
      if (search.trim()) { 
        params.append("search", search.trim()); 
      } 
 
      if (department !== "All") { 
        params.append("department", department); 
      } 
 
      const response = await fetch( 
        `${API_URL}/api/employees?${params.toString()}` 
      ); 
 
      if (!response.ok) { 
        throw new Error("Unable to load employees"); 
      } 
 
      const data = await response.json(); 
      setEmployees(data); 
    } catch (err) { 
      setError( 
        `${err.message}. Please check the backend connection.` 
      ); 
    } finally { 
      setLoading(false); 
    } 
  } 
 
  const totalEmployees = employees.length; 
 
  const engineeringEmployees = useMemo(() => { 
    return employees.filter( 
      (employee) => employee.department === "Engineering" 
    ).length; 
  }, [employees]); 
 
  return ( 
    <div className="app"> 
      <header className="hero"> 
        <div> 
          <p className="eyebrow">DEVOPS CAPSTONE PROJECT</p> 
 
          <h1>Employee Management Portal</h1> 
 
          <p className="subtitle"> 
            Explore employee information through a modern 
            two-tier web application. 
          </p> 
        </div> 
 
        <div className="status-card"> 
          <span className="status-dot"></span> 
          Backend API Connected 
        </div> 
      </header> 
 
      <main className="container"> 
        <section className="summary-grid"> 
          <div className="summary-card"> 
            <span>Total Employees</span> 
            <strong>{totalEmployees}</strong> 
          </div> 
 
          <div className="summary-card"> 
            <span>Engineering Team</span> 
            <strong>{engineeringEmployees}</strong> 
          </div> 
 
          <div className="summary-card"> 
            <span>Selected Department</span> 
            <strong>{department}</strong> 
          </div> 
        </section> 
 
        <section className="controls"> 
          <div className="field"> 
            <label htmlFor="search">Search Employees</label> 
 
            <input 
              id="search" 
              type="text" 
              placeholder="Search by name, role, or email..." 
              value={search} 
              onChange={(event) => 
                setSearch(event.target.value) 
              } 
            /> 
          </div> 
 
          <div className="field"> 
            <label htmlFor="department"> 
              Filter by Department 
            </label> 
 
            <select 
              id="department" 
              value={department} 
              onChange={(event) => 
                setDepartment(event.target.value) 
              } 
            > 
              {departments.map((item) => ( 
                <option key={item} value={item}> 
                  {item} 
                </option> 
              ))} 
            </select> 
          </div> 
        </section> 
 
        {error && ( 
          <div className="error-message"> 
            {error} 
          </div> 
        )} 
 
        {loading ? ( 
          <div className="message"> 
            Loading employees... 
          </div> 
        ) : employees.length === 0 ? ( 
          <div className="message"> 
            No employees found. 
          </div> 
        ) : ( 
          <section className="employee-grid"> 
            {employees.map((employee) => ( 
              <article 
                className="employee-card" 
                key={employee.id} 
              > 
                <div className="avatar"> 
                  {employee.name.charAt(0)} 
                </div> 
 
                <div className="employee-content"> 
                  <h2>{employee.name}</h2> 
 
                  <p className="role"> 
                    {employee.role} 
                  </p> 
 
                  <div className="employee-details"> 
                    <p> 
                      <strong>Email:</strong>{" "} 
                      {employee.email} 
                    </p> 
 
                    <p> 
                      <strong>Department:</strong>{" "} 
                      {employee.department} 
                    </p> 
 
                    <p> 
                      <strong>Location:</strong>{" "} 
                      {employee.location} 
                    </p> 
 
                    <p> 
                      <strong>Experience:</strong>{" "} 
                      {employee.experience} years 
                    </p> 
                  </div> 
                </div> 
              </article> 
            ))} 
          </section> 
        )} 
      </main> 
 
      <footer className="footer"> 
        Employee Management Portal · DevOps Capstone 
        Project 
      </footer> 
    </div> 
  ); 
} 
 
export default App;

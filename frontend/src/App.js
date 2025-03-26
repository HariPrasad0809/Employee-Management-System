import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import logo from "./logo.jpg"; // Placed in a dedicated assets folder
import "./App.css";
import EmployeeList from "./components/EmployeeList";
import AddEmployee from "./components/AddEmployee";
import EditEmployee from "./components/EditEmployee";

function App() {
  const [showEmployees, setShowEmployees] = useState(false);

  return (
    <Router>
      <div className="App">
        {/* Header Section */}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="Company Logo" />
          <h1>Employee Management System</h1>
        </header>

        {/* Button to Show/Hide Employees */}
        <div style={{ textAlign: "center", margin: "20px" }}>
          <button
            onClick={() => setShowEmployees(!showEmployees)}
            style={{
              padding: "10px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px"
            }}
          >
            {showEmployees ? "Hide Employees" : "Show Employees"}
          </button>
        </div>

        {/* Routes */}
        <main className="App-container">
          {showEmployees && <EmployeeList />} {/* Show only when button is clicked */}
          <Routes>
            <Route path="/add" element={<AddEmployee />} />
            <Route path="/edit/:id" element={<EditEmployee />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

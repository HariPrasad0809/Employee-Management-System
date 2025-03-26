import React, { useState } from "react";
import axios from "axios";

const AddEmployee = () => {
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        position: "",
        salary: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: name === "salary" ? parseFloat(value) || "" : value // Ensure salary is a number
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/employees", {
                ...employee,
                salary: parseFloat(employee.salary) || 0 // Ensure salary is sent as a number
            });
            alert("Employee added successfully!");
            setEmployee({ name: "", email: "", position: "", salary: "" });
        } catch (error) {
            console.error("Error adding employee:", error);
            alert(error.response?.data?.error || "Failed to add employee");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
            <h2 style={{ textAlign: "center" }}>Add Employee</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label>
                    Name:
                    <input type="text" name="name" value={employee.name} onChange={handleChange} required />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" value={employee.email} onChange={handleChange} required />
                </label>
                <label>
                    Position:
                    <input type="text" name="position" value={employee.position} onChange={handleChange} required />
                </label>
                <label>
                    Salary:
                    <input type="number" name="salary" value={employee.salary} onChange={handleChange} required />
                </label>
                <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
                    Add Employee
                </button>
            </form>
        </div>
    );
};

export default AddEmployee;

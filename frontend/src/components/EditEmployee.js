import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: "",
        email: "",
        position: "",
        salary: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Fetching employee with ID:", id);  // Debugging ID
        axios.get(`http://localhost:8080/api/employees/${id}`)
            .then(response => {
                console.log("API Response:", response.data);  // Debugging API response
                setEmployee(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching employee data:", error);
                setError("Failed to fetch employee details.");
                setLoading(false);
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: name === "salary" ? parseFloat(value) || 0 : value // Ensure salary is float
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Employee Data:", employee); // Debugging Update Data
        try {
            await axios.put(`http://localhost:8080/api/employees/${id}`, employee);
            alert("Employee updated successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error updating employee:", error);
            setError("Failed to update employee. Please try again.");
        }
    };

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

    return (
        <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)" }}>
            <h2 style={{ textAlign: "center" }}>Edit Employee</h2>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
                    Update Employee
                </button>
            </form>
        </div>
    );
};

export default EditEmployee;
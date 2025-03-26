import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/employees')
            .then(response => {
                setEmployees(response.data || []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching employees:', error);
                setError("Failed to load employee data.");
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/employees/${id}`);
            setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
            alert("Employee deleted successfully!");
        } catch (error) {
            console.error('Error deleting employee:', error);
            setError("Failed to delete employee.");
        }
    };

    return (
        <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
            <h2 style={{ textAlign: "center" }}>Employee List</h2>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            <Link to="/add" style={{ textDecoration: "none", padding: "10px", backgroundColor: "#28a745", color: "white", borderRadius: "5px" }}>
                Add Employee
            </Link>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f4f4f4" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>First Name</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Last Name</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Position</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map(employee => (
                                <tr key={employee.id}>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{employee.id}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{employee.first_name}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{employee.last_name}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>{employee.position}</td>
                                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                        <Link to={`/edit/${employee.id}`} style={{ marginRight: "10px", textDecoration: "none", color: "blue" }}>Edit</Link>
                                        <button onClick={() => handleDelete(employee.id)} style={{ backgroundColor: "red", color: "white", border: "none", padding: "5px", cursor: "pointer" }}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", padding: "10px" }}>No employees found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeList;

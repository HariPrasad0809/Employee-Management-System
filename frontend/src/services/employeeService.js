import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/employees';

// Helper function to handle API responses
const handleResponse = (response) => response.data;

// Helper function to handle errors
const handleError = (error, action) => {
    console.error(`Error ${action} employee:`, error.response?.data || error.message);
    throw error;
};

// Fetch all employees
export const getEmployees = async () => {
    try {
        const response = await axios.get(BASE_URL);
        return handleResponse(response);
    } catch (error) {
        handleError(error, 'fetching');
    }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return handleResponse(response);
    } catch (error) {
        handleError(error, 'fetching');
    }
};

// Add a new employee (Fixed first_name & last_name issue)
export const addEmployee = async (employeeData) => {
    try {
        // Combine first_name and last_name into name
        const formattedData = {
            name: `${employeeData.first_name} ${employeeData.last_name}`, // Fixing column mismatch
            email: employeeData.email,
            position: employeeData.position,
            salary: employeeData.salary || 0 // Default salary if not provided
        };

        const response = await axios.post(BASE_URL, formattedData);
        return handleResponse(response);
    } catch (error) {
        handleError(error, 'adding');
    }
};

// Update an existing employee
export const updateEmployee = async (id, updatedData) => {
    try {
        // Combine first_name and last_name into name
        const formattedData = {
            name: `${updatedData.first_name} ${updatedData.last_name}`,
            email: updatedData.email,
            position: updatedData.position,
            salary: updatedData.salary || 0
        };

        const response = await axios.put(`${BASE_URL}/${id}`, formattedData);
        return handleResponse(response);
    } catch (error) {
        handleError(error, 'updating');
    }
};

// Delete an employee
export const deleteEmployee = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return handleResponse(response);
    } catch (error) {
        handleError(error, 'deleting');
    }
};

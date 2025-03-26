package controllers

import (
	"database/sql"
	"employee-management-system/config"
	"employee-management-system/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Fetch all employees (excluding soft-deleted ones)
func GetEmployees(c *gin.Context) {
	log.Println("Fetching all employees...")
	rows, err := config.DB.Query("SELECT id, name, email, position, salary FROM employees WHERE is_deleted = FALSE")
	if err != nil {
		log.Println("Error fetching employees:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var employees []models.Employee
	for rows.Next() {
		var emp models.Employee
		if err := rows.Scan(&emp.ID, &emp.Name, &emp.Email, &emp.Position, &emp.Salary); err != nil {
			log.Println("Error scanning employee record:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		employees = append(employees, emp)
	}

	c.JSON(http.StatusOK, employees)
}

// Fetch an employee by ID
func GetEmployeeByID(c *gin.Context) {
	id := c.Param("id")
	log.Println("Fetching employee by ID:", id)

	var emp models.Employee
	err := config.DB.QueryRow("SELECT id, name, email, position, salary FROM employees WHERE id=$1 AND is_deleted=FALSE", id).
		Scan(&emp.ID, &emp.Name, &emp.Email, &emp.Position, &emp.Salary)

	if err == sql.ErrNoRows {
		log.Println("Employee not found:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	} else if err != nil {
		log.Println("Error fetching employee:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, emp)
}

// Create a new employee
func CreateEmployee(c *gin.Context) {
	var emp models.Employee
	if err := c.ShouldBindJSON(&emp); err != nil {
		log.Println("Invalid request body:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Println("Received request to add employee:", emp)

	sqlStatement := `INSERT INTO employees (name, email, position, salary, created_at, updated_at) 
	                 VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id`
	err := config.DB.QueryRow(sqlStatement, emp.Name, emp.Email, emp.Position, emp.Salary).Scan(&emp.ID)
	if err != nil {
		log.Println("Error inserting employee:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println("Employee added successfully with ID:", emp.ID)
	c.JSON(http.StatusCreated, emp)
}

// Update an employee
func UpdateEmployee(c *gin.Context) {
	id := c.Param("id")
	log.Println("Updating employee with ID:", id)

	var emp models.Employee
	if err := c.ShouldBindJSON(&emp); err != nil {
		log.Println("Invalid request body for update:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	sqlStatement := `UPDATE employees 
	                 SET name=$1, email=$2, position=$3, salary=$4, updated_at=NOW() 
	                 WHERE id=$5 AND is_deleted=FALSE`

	res, err := config.DB.Exec(sqlStatement, emp.Name, emp.Email, emp.Position, emp.Salary, id)
	if err != nil {
		log.Println("Error updating employee:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		log.Println("Employee not found for update:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	log.Println("Employee updated successfully:", id)
	c.JSON(http.StatusOK, gin.H{"message": "Employee updated successfully"})
}

// Soft delete an employee
func DeleteEmployee(c *gin.Context) {
	id := c.Param("id")
	log.Println("Soft deleting employee with ID:", id)

	sqlStatement := `UPDATE employees SET is_deleted=TRUE, updated_at=NOW() WHERE id=$1`
	res, err := config.DB.Exec(sqlStatement, id)
	if err != nil {
		log.Println("Error deleting employee:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		log.Println("Employee not found for deletion:", id)
		c.JSON(http.StatusNotFound, gin.H{"error": "Employee not found"})
		return
	}

	log.Println("Employee deleted successfully:", id)
	c.JSON(http.StatusOK, gin.H{"message": "Employee deleted successfully"})
}

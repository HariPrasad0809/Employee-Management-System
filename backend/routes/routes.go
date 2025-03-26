package routes

import (
	"employee-management-system/controllers"

	"github.com/gin-gonic/gin"
)

func EmployeeRoutes(router *gin.Engine) {
	api := router.Group("/api/employees")
	{
		api.GET("", controllers.GetEmployees) // Removed trailing slash for consistency
		api.GET("/:id", controllers.GetEmployeeByID)
		api.POST("", controllers.CreateEmployee)
		api.PUT("/:id", controllers.UpdateEmployee)
		api.DELETE("/:id", controllers.DeleteEmployee)
	}
}

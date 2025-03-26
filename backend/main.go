package main

import (
	"log"
	"os"

	"employee-management-system/config"
	"employee-management-system/middleware"
	"employee-management-system/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Warning: No .env file found, using system environment variables")
	}

	// Connect to database
	config.Connect()

	// Initialize router
	router := gin.Default()

	// Middleware
	router.Use(middleware.CORSMiddleware())

	// Routes
	routes.EmployeeRoutes(router)

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Server is running on port %s...", port)
	router.Run(":" + port)
}

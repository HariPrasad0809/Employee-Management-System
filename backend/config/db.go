package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Connect() {
	var err error
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	psqlInfo := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbPort, dbUser, dbPassword, dbName,
	)

	DB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	// Set connection pool settings
	DB.SetMaxOpenConns(10) // Max open connections
	DB.SetMaxIdleConns(5)  // Max idle connections
	DB.SetConnMaxLifetime(30 * time.Minute)

	err = DB.Ping()
	if err != nil {
		log.Fatalf("Cannot ping database: %v", err)
	}

	fmt.Println("Successfully connected to database!")
}

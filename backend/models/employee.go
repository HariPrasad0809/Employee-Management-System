package models

import (
	"time"
)

type Employee struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	Name      string    `json:"name" gorm:"not null"`
	LastName  string    `json:"last_name" gorm:"not null"`
	Email     string    `json:"email" gorm:"unique;not null"`
	Position  string    `json:"position"`
	Salary    float64   `json:"salary" gorm:"not null"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
	UpdatedAt time.Time `json:"updated_at" gorm:"autoUpdateTime"`
	IsDeleted bool      `json:"is_deleted" gorm:"default:false"`
}

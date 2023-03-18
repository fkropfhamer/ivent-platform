package main

import (
	"fmt"
	"ivent-api/models"
)

func CleanDB() {
	fmt.Println("Cleaning db...")
	if err := models.DeleteAllExpiredTokens(); err != nil {
		fmt.Println("Something went wrong :'(")
		return
	}
	fmt.Println("DB cleaned successfully")
}

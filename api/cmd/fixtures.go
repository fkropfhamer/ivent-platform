package main

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ivent-api/db"
	"ivent-api/models"
	"strconv"
)

func createExampleEvents(testUser *models.User) {
	for i := 0; i < 50; i++ {
		event := models.Event{
			ID:      primitive.NewObjectID(),
			Name:    "event" + strconv.Itoa(i),
			Creator: testUser.Id,
		}

		_, err := models.CreateEvent(&event)
		if err != nil {
			return
		}
	}

}

func createAdmin() *models.User {
	admin := models.User{
		Id:       primitive.NewObjectID(),
		Name:     "admin",
		Password: "admin",
		Role:     models.RoleAdmin,
	}

	if err := models.CreateUser(&admin); err != nil {
		return nil
	}

	return &admin
}

func createTestUser() *models.User {
	testUser := models.User{
		Id:       primitive.NewObjectID(),
		Name:     "TestUser",
		Password: "admin",
		Role:     models.RoleUser,
	}

	err := models.CreateUser(&testUser)

	if err != nil {
		return nil
	}

	return &testUser
}

func LoadFixtures() {
	fmt.Println("Loading fixtures...")
	db.DB.Drop(context.Background())
	testUser := createTestUser()
	createExampleEvents(testUser)
	createAdmin()
	fmt.Println("Fixtures loaded successfully")
}

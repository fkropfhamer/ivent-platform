package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"networking-events-api/db"
	"networking-events-api/models"
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

func createTestUser() *models.User {
	testUser := models.User{
		Id:       primitive.NewObjectID(),
		Name:     "TestUser",
		Password: "admin",
	}

	err := models.CreateUser(&testUser)

	if err != nil {
		return nil
	}

	return &testUser
}

func loadFixtures() {
	db.DB.Drop(context.Background())
	testUser := createTestUser()
	createExampleEvents(testUser)
}

func main() {
	loadFixtures()
}

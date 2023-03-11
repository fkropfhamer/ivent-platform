package main

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"networking-events-api/models"
	"strconv"
)

func CreateExampleEvents(testUser *models.User) {

	for i := 0; i < 10; i++ {
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

func CreateTestUser() *models.User {
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

func PopulateDb() {

	if events, err := models.GetEvents(); len(events) >= 10 {
		if err != nil {
			return
		}

		return
	}

	testUser := CreateTestUser()

	if testUser == nil {
		return
	}

	CreateExampleEvents(testUser)

}

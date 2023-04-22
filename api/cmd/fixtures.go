package main

import (
	"context"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ivent-api/config"
	"ivent-api/db"
	"ivent-api/models"
	"strconv"
)

func createConstantJWT(userID *primitive.ObjectID, role models.Role) string {
	claims := jwt.MapClaims{
		"id":   userID.Hex(),
		"iat":  1234,
		"role": role,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.Secret))

	if err != nil {
		return ""
	}

	return tokenString
}

func createExampleEvents(testUser *models.User) {
	for i := 0; i < 50; i++ {
		event := models.Event{
			ID:        primitive.NewObjectID(),
			Name:      "event" + strconv.Itoa(i),
			Location:  "online",
			PriceInfo: "free",
			Organizer: "Organizer " + strconv.Itoa(i%3),
			Link:      "https://example.com/",
			Creator:   testUser.Id,
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

func createServiceUser() *models.User {
	userId, err := primitive.ObjectIDFromHex("641998f2f2bf9118b1cf686a")
	if err != nil {
		return nil
	}

	token := createConstantJWT(&userId, models.RoleService)

	serviceUser, err := models.CreateServiceAccount(userId, "service", token)
	if err != nil {
		return nil
	}

	fmt.Printf("Service account token: %s \n", token)

	return serviceUser
}

func LoadFixtures() {
	fmt.Println("Loading fixtures...")
	db.DB.Drop(context.Background())
	testUser := createTestUser()
	createExampleEvents(testUser)
	createAdmin()
	createServiceUser()
	fmt.Println("Fixtures loaded successfully")
}

package models

import (
	"context"
	"networking-events-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id   primitive.ObjectID
	Name string
}

func CreateUser(newUser *User) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	_, err := db.UserCollection.InsertOne(ctx, newUser)

	return err
}

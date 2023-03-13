package models

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"networking-events-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id       primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name     string
	Password string
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 13)
	return string(bytes), err
}

func CreateUser(newUser *User) error {
	passwordHash, err := hashPassword(newUser.Password)

	if err != nil {
		return err
	}

	newUser.Password = passwordHash

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = db.UserCollection.InsertOne(ctx, newUser)

	return err
}

func DeleteUser(id *primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := db.UserCollection.DeleteOne(ctx, bson.M{"_id": id})

	return err
}

package models

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/bson"
	"ivent-api/db"
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

func UpdateUser(id *primitive.ObjectID, update interface{}) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	result, err := db.UserCollection.UpdateByID(ctx, id, update)
	if err != nil || result.MatchedCount == 0 {
		return errors.New("update failed")
	}

	return nil
}

func UpdatePassword(id *primitive.ObjectID, newPassword string) error {
	password, err := hashPassword(newPassword)
	if err != nil {
		return err
	}

	if err := UpdateUser(id, bson.M{"$set": bson.M{"password": password}}); err != nil {
		return err
	}

	err = DeleteAllRefreshTokenForUser(id)

	return err
}

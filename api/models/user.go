package models

import (
	"context"
	"errors"
	"fmt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ivent-api/db"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id           primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name         string             `json:"name"`
	Role         Role               `json:"role"`
	Password     string             `json:"-"`
	Token        string             `json:"-"`
	MarkedEvents []primitive.ObjectID
}

type Role string

const (
	RoleAdmin   Role = "ROLE_ADMIN"
	RoleUser    Role = "ROLE_USER"
	RoleService Role = "ROLE_SERVICE"
)

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
		fmt.Println(err)

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

func UpdateUserRole(id *primitive.ObjectID, newUserRole Role) error {
	if err := UpdateUser(id, bson.M{"$set": bson.M{"role": newUserRole}}); err != nil {
		return err
	}
	return nil
}

func GetUser(id *primitive.ObjectID) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user User
	if err := db.UserCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&user); err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUsers(page int64) ([]User, int64, error) {
	pageLimit := int64(15)
	skip := page * pageLimit
	filter := bson.D{}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	count, err := db.UserCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.FindOptions{
		Skip:  &skip,
		Limit: &pageLimit,
	}

	cursor, err := db.UserCollection.Find(ctx, filter, &opts)
	if err != nil {
		return nil, count, err
	}

	results := []User{}
	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := cursor.All(ctx, &results); err != nil {
		log.Fatal(err)

		return nil, count, err
	}

	return results, count, nil
}

func CreateServiceAccount(id primitive.ObjectID, username string, token string) (*User, error) {
	user := User{Id: id, Role: RoleService, Name: username, Token: token}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := db.UserCollection.InsertOne(ctx, user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

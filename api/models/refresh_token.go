package models

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"ivent-api/config"
	"ivent-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RefreshToken struct {
	ID   string `bson:"_id"`
	IAT  int64
	User primitive.ObjectID
}

func CreateRefreshToken(userID *primitive.ObjectID) (string, error) {
	token := createRandomToken()
	if token == "" {
		return "", errors.New("token creation failed")
	}

	tokenObject := RefreshToken{
		ID:   token,
		IAT:  time.Now().Unix(),
		User: *userID,
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := db.RefreshTokenCollection.InsertOne(ctx, tokenObject)
	if err != nil {
		return "", err
	}

	return token, nil
}

func DeleteRefreshToken(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := db.RefreshTokenCollection.DeleteOne(ctx, bson.M{"_id": id})

	return err
}

func DeleteAllExpiredTokens() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	limit := time.Now().Unix() - config.RefreshLifetime
	_, err := db.RefreshTokenCollection.DeleteMany(ctx, bson.M{"iat": bson.M{"$lt": limit}})

	return err
}

func DeleteAllRefreshTokenForUser(userId *primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := db.RefreshTokenCollection.DeleteMany(ctx, bson.M{"user": userId})

	return err
}

func GetRefreshToken(id string) (*RefreshToken, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var token RefreshToken
	filter := bson.M{"_id": id}
	if err := db.RefreshTokenCollection.FindOne(ctx, filter).Decode(&token); err != nil {
		return nil, err
	}

	return &token, nil
}

func createRandomToken() string {
	length := 32
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

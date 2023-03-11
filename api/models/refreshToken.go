package models

import (
	"context"
	"networking-events-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RefreshToken struct {
	ID    primitive.ObjectID
	token string
	iat   int64
}

func createRefreshToken() (string, error) {
	token := ""

	tokenObject := RefreshToken{
		ID:    primitive.NewObjectID(),
		token: token,
		iat:   time.Now().Unix(),
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	_, err := db.RefreshTokenCollection.InsertOne(ctx, tokenObject)
	if err != nil {
		return "", err
	}

	return token, nil
}

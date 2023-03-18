package models

import (
	"context"
	"ivent-api/config"
	"ivent-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RefreshToken struct {
	ID   primitive.ObjectID `bson:"_id"`
	IAT  int64
	User primitive.ObjectID
}

func CreateRefreshToken(userID *primitive.ObjectID) (string, error) {
	token := primitive.NewObjectID()

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

	return token.Hex(), nil
}

func DeleteRefreshToken(id primitive.ObjectID) error {
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
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var token RefreshToken
	filter := bson.M{"_id": objectID}
	if err := db.RefreshTokenCollection.FindOne(ctx, filter).Decode(&token); err != nil {
		return nil, err
	}

	return &token, nil
}

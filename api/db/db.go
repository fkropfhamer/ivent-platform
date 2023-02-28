package db

import (
	"context"
	"time"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB_STRING = "mongodb://localhost:27017"
var DB_NAME = "events"

func ConnectDB() *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(DB_STRING))
	if err != nil {

	}

	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()
	err = client.Connect(ctx)

	if err != nil {

	}

	err = client.Ping(ctx, nil)
	if err != nil {

	}

	return client
}

var DB *mongo.Client = ConnectDB()

func GetCollection(collectionName string) *mongo.Collection {
    collection := DB.Database(DB_NAME).Collection(collectionName)
    return collection
}

var UserCollection *mongo.Collection = GetCollection("users")

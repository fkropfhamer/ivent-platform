package db

import (
	"context"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func getDbUrl() string {
	DbEnv := os.Getenv("DB_URL")
	if DbEnv == "" {
		return "mongodb://localhost:27017"
	}

	return DbEnv
}

var dbUrl = getDbUrl()

const DB_NAME = "events"

func ConnectDB() *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(dbUrl))
	if err != nil {

	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)

	if err != nil {

	}

	err = client.Ping(ctx, nil)
	if err != nil {

	}

	return client
}

var DB *mongo.Database = ConnectDB().Database(DB_NAME)

func GetCollection(collectionName string) *mongo.Collection {
	collection := DB.Collection(collectionName)
	return collection
}

var UserCollection *mongo.Collection = GetCollection("users")
var EventsCollection *mongo.Collection = GetCollection("events")
var RefreshTokenCollection *mongo.Collection = GetCollection("refreshToken")

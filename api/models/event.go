package models

import (
	"context"
	"errors"
	"log"
	"networking-events-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID      primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name    string             `json:"name"`
	Creator primitive.ObjectID
}

func CreateEvent(newEvent *Event) (*primitive.ObjectID, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	result, err := db.EventsCollection.InsertOne(ctx, newEvent)

	if err != nil {
		return nil, errors.New("insertion failed")
	}

	if id, ok := result.InsertedID.(primitive.ObjectID); ok {
		return &id, nil
	}

	return nil, errors.New("invalid id")
}

func GetEvents() ([]Event, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	cursor, err := db.EventsCollection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}

	results := []Event{}
	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	if err := cursor.All(ctx, &results); err != nil {
		log.Fatal(err)

		return nil, err
	}

	return results, nil
}

func GetEvent(id string) (*Event, error) {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("bad id")
	}

	var event Event

	filter := bson.M{"_id": objectID}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.EventsCollection.FindOne(ctx, filter).Decode(&event); err != nil {

		return nil, errors.New("event not found")
	}

	return &event, nil
}

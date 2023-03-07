package models

import (
	"context"
	"errors"
	"networking-events-api/db"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID      primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name    string
	Creator primitive.ObjectID
}

func CreateEvent(newEvent *Event) (*primitive.ObjectID, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	result, err := db.EventsCollection.InsertOne(ctx, newEvent)

	if err != nil {
		return nil, err
	}

	if id, ok := result.InsertedID.(primitive.ObjectID); ok {
		return &id, nil
	}

	return nil, errors.New("invalid id")
}

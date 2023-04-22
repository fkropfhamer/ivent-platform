package models

import (
	"context"
	"errors"
	"go.mongodb.org/mongo-driver/mongo/options"
	"ivent-api/db"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID          primitive.ObjectID `bson:"_id" json:"id,omitempty"`
	Name        string             `json:"name"`
	Description string
	Start       *primitive.DateTime
	End         *primitive.DateTime
	Identifier  *string
	Location    string
	PriceInfo   string `bson:"price_info" json:"price_info"`
	Organizer   string
	Link        string
	Creator     primitive.ObjectID
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

type ResponseEvent struct {
	ID          primitive.ObjectID `json:"id,omitempty"`
	Name        string             `json:"name"`
	Description string
	Start       *primitive.DateTime
	End         *primitive.DateTime
	Identifier  *string
	Location    string
	PriceInfo   string `json:"price_info"`
	Organizer   string
	Link        string
	Creator     primitive.ObjectID
	IsMarked    bool `json:"is_marked" binding:"required"`
}

func fromEvent(event *Event) ResponseEvent {
	return ResponseEvent{
		ID:          event.ID,
		Name:        event.Name,
		Description: event.Description,
		Start:       event.Start,
		End:         event.End,
		Identifier:  event.Identifier,
		Location:    event.Location,
		PriceInfo:   event.PriceInfo,
		Organizer:   event.Organizer,
		Link:        event.Link,
		Creator:     event.Creator,
		IsMarked:    false,
	}
}

func GetEvents(page int64, filter bson.M) ([]Event, int64, error) {
	pageLimit := int64(15)
	skip := page * pageLimit
	if filter == nil {
		filter = bson.M{}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	count, err := db.EventsCollection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.FindOptions{
		Skip:  &skip,
		Limit: &pageLimit,
	}

	cursor, err := db.EventsCollection.Find(ctx, filter, &opts)
	if err != nil {
		return nil, count, err
	}

	results := []Event{}
	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := cursor.All(ctx, &results); err != nil {
		log.Fatal(err)

		return nil, count, err
	}

	return results, count, nil
}

func MapEventsToResponseEvents(events *[]Event, markedIds *[]primitive.ObjectID) *[]ResponseEvent {
	responseResults := make([]ResponseEvent, len(*events))

	if markedIds != nil {
		idMap := make(map[primitive.ObjectID]bool)
		for _, id := range *markedIds {
			idMap[id] = true
		}

		for i, result := range *events {
			responseResults[i] = fromEvent(&result)
			responseResults[i].IsMarked = idMap[result.ID]
		}

		return &responseResults
	}

	for i, result := range *events {
		responseResults[i] = fromEvent(&result)
	}

	return &responseResults
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

func DeleteEvent(id string) error {
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("bad id")
	}

	filter := bson.M{"_id": objectID}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if _, err := db.EventsCollection.DeleteOne(ctx, filter); err != nil {
		return err
	}

	return nil
}

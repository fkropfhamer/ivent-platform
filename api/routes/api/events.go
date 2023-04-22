package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ivent-api/models"
	"net/http"
	"strconv"
	"time"
)

type createEventRequestBody struct {
	Name       string
	Start      string
	End        string
	Identifier string
	Location   string
	PriceInfo  string `bson:"price_info" json:"price_info"`
	Organizer  string
	Link       string
}

func CreateEventHandler(c *gin.Context) {
	user, err := Authenticate(c, models.RoleService)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	var body createEventRequestBody
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error",
		})

		return
	}

	if body.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "name can not be empty",
		})

		return
	}

	event := models.Event{
		ID:        primitive.NewObjectID(),
		Name:      body.Name,
		Location:  body.Location,
		PriceInfo: body.PriceInfo,
		Organizer: body.Organizer,
		Link:      body.Link,
		Creator:   user.Id,
	}

	if body.End != "" {
		t, err := time.Parse(time.RFC3339, body.End)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "unable to parse end time",
			})

			return
		}

		datetime := primitive.NewDateTimeFromTime(t)

		event.End = &datetime
	}

	if body.Start != "" {
		t, err := time.Parse(time.RFC3339, body.Start)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "unable to parse start time",
			})

			return
		}

		datetime := primitive.NewDateTimeFromTime(t)

		event.Start = &datetime
	}

	if body.Identifier != "" {
		event.Identifier = &body.Identifier
	}

	id, err := models.CreateEvent(&event)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "event created",
		"id":      id,
	})
}

func ListEventsHandler(c *gin.Context) {
	user, _ := Authenticate(c, models.RoleUser)

	pageParam := c.Query("page")
	page, err := strconv.ParseInt(pageParam, 10, 64)
	if err != nil {
		page = 0
	}

	filter := bson.M{}
	organizerParam := c.Query("organizer")
	if organizerParam != "" {
		filter["organizer"] = bson.M{"$in": []string{organizerParam}}
	}

	markedParam := c.Query("marked")
	if markedParam != "" {
		if user == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"message": "query param marked requires authorization",
			})

			return
		}

		if &user.MarkedEvents == nil || len(user.MarkedEvents) == 0 {
			c.JSON(http.StatusOK, gin.H{
				"events": make([]models.Event, 0),
				"count":  0,
				"page":   page,
			})

			return
		}

		filter["_id"] = bson.M{"$in": user.MarkedEvents}
	}

	events, count, err := models.GetEvents(page, filter)

	if err != nil {
		fmt.Println(err)

		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	if user == nil {
		c.JSON(http.StatusOK, gin.H{
			"events": events,
			"count":  count,
			"page":   page,
		})

		return
	}

	responseEvents := models.MapEventsToResponseEvents(&events, &user.MarkedEvents)
	c.JSON(http.StatusOK, gin.H{
		"events": responseEvents,
		"count":  count,
		"page":   page,
	})
}

func GetEventHandler(c *gin.Context) {
	id := c.Param("id")

	event, err := models.GetEvent(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, event)
}

func DeleteEventHandler(c *gin.Context) {
	id := c.Param("id")

	if err := models.DeleteEvent(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "event deleted",
	})
}

func UnMarkEventHandler(c *gin.Context) {
	user, err := Authenticate(c, models.RoleUser)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "forbidden",
		})

		return
	}

	eventId, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid eventid",
		})

		return
	}

	if user.MarkedEvents == nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "event unmarked",
		})
	}

	update := bson.M{"$pull": bson.M{"markedevents": eventId}}
	err = models.UpdateUser(&user.Id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "unmarking failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "event unmarked",
	})
}

func MarkEventHandler(c *gin.Context) {
	user, err := Authenticate(c, models.RoleUser)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "forbidden",
		})

		return
	}

	eventId := c.Param("id")

	event, err := models.GetEvent(eventId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "event not found",
		})

		return
	}

	update := bson.M{"$addToSet": bson.M{"markedevents": event.ID}}
	if user.MarkedEvents == nil {
		update = bson.M{"$set": bson.M{"markedevents": []primitive.ObjectID{event.ID}}}
	}

	err = models.UpdateUser(&user.Id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "marking failed",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "event marked",
	})
}

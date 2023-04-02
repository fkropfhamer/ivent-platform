package api

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ivent-api/models"
	"net/http"
	"strconv"
	"time"
)

type createEventRequestBody struct {
	Name      string
	Date      string
	Location  string
	PriceInfo string `bson:"price_info" json:"price_info"`
	Organizer string
	Link      string
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

	dateTime, err := time.Parse("2006-01-02", body.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid date format",
		})

		return
	}

	event := models.Event{
		ID:        primitive.NewObjectID(),
		Name:      body.Name,
		Date:      primitive.NewDateTimeFromTime(dateTime),
		Location:  body.Location,
		PriceInfo: body.PriceInfo,
		Organizer: body.Organizer,
		Link:      body.Link,
		Creator:   user.Id,
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
	pageParam := c.Query("page")
	page, err := strconv.ParseInt(pageParam, 10, 64)
	if err != nil {
		page = 0
	}

	events, count, err := models.GetEvents(page)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"events": events,
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

func MarkEventHandler(c *gin.Context) {
	user, err := Authenticate(c, models.RoleService)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
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

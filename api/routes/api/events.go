package api

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ivent-api/models"
	"net/http"
	"strconv"
)

type createEventRequestBody struct {
	Name      string
	Date      primitive.DateTime
	Location  string
	PriceInfo string
	Organizer string
	Link      string
}

func CreateEventHandler(c *gin.Context) {
	userId, err := Authenticate(c, models.RoleService)

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
		Date:      body.Date,
		Location:  body.Location,
		PriceInfo: body.PriceInfo,
		Organizer: body.Organizer,
		Link:      body.Link,
		Creator:   *userId,
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

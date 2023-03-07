package api

import (
	"net/http"
	"networking-events-api/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type createEventRequestBody struct {
	Name string
}

func CreateEventHandler(c *gin.Context) {
	userId, err := Authenticate(c)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{
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
			"message": "name can not be emptry",
		})

		return
	}

	event := models.Event{
		ID:      primitive.NewObjectID(),
		Name:    body.Name,
		Creator: *userId,
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

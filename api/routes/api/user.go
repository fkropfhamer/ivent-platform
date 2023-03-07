package api

import (
	"context"
	"net/http"
	"networking-events-api/db"
	"networking-events-api/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ProfileHandle(c *gin.Context) {
	_, err := Authenticate(c)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "profile",
	})
}

func CreateUserHandle(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	newUser := models.User{
		Id:   primitive.NewObjectID(),
		Name: "a",
	}

	_, err := db.UserCollection.InsertOne(ctx, newUser)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user created",
	})
}

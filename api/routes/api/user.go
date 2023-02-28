package api

import (
	"context"
	"time"
	"net/http"
	"github.com/gin-gonic/gin"
	"networking-events-api/models"
	"networking-events-api/db"
	"go.mongodb.org/mongo-driver/bson/primitive"
)



func ProfileHandle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "profile",
	})
}


func CreateUserHandle(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    
    defer cancel()


	newUser := models.User{
		Id: primitive.NewObjectID(),
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
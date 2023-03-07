package api

import (
	"net/http"
	"networking-events-api/models"

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

type createUserRequestBody struct {
	Username string
	Password string
}

func CreateUserHandle(c *gin.Context) {
	var body createUserRequestBody

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "error",
		})
		return
	}

	newUser := models.User{
		Id:   primitive.NewObjectID(),
		Name: body.Username,
	}

	err := models.CreateUser(&newUser)

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

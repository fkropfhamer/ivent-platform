package api

import (
	"context"
	"net/http"
	"networking-events-api/db"
	"networking-events-api/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ProfileHandle(c *gin.Context) {
	userId, err := Authenticate(c)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	var user models.User
	filter := bson.M{"_id": userId}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.UserCollection.FindOne(ctx, filter).Decode(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "profile",
		"username": user.Name,
		"id":       userId,
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

type registerRequestBody struct {
	Username string
	Password string
}

func RegisterHandle(c *gin.Context) {
	var body registerRequestBody

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid body",
		})

		return
	}

	if body.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "password can not be empty",
		})

		return
	}

	if body.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "username can not be empty",
		})

		return
	}

	newUser := models.User{
		Id:       primitive.NewObjectID(),
		Name:     body.Username,
		Password: body.Password,
	}

	err := models.CreateUser(&newUser)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"message": "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user registered",
	})
}

func DeleteAccountHandle(c *gin.Context) {
	id, err := Authenticate(c)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	if err := models.DeleteUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	if err := models.DeleteAllRefreshTokenForUser(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error2",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "acc deleted",
	})
}

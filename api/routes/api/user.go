package api

import (
	"context"
	"ivent-api/db"
	"ivent-api/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ProfileHandle(c *gin.Context) {
	userId, err := Authenticate(c, models.RoleUser)

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
		c.JSON(http.StatusBadRequest, gin.H{
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
		Role:     models.RoleUser,
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
	id, err := Authenticate(c, models.RoleUser)
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
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "acc deleted",
	})
}

type ChangePasswordRequestBody struct {
	CurrentPassword string
	NewPassword     string
}

func ChangePasswordHandle(c *gin.Context) {
	id, err := Authenticate(c, models.RoleUser)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	var body ChangePasswordRequestBody
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid body",
		})

		return
	}

	if err := CheckPassword(id, body.CurrentPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid password",
		})

		return
	}

	if err := models.UpdatePassword(id, body.NewPassword); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "password updated",
	})
}

func ListUsersHandle(c *gin.Context) {
	if _, err := Authenticate(c, models.RoleAdmin); err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "error",
		})

		return
	}

	pageParam := c.Query("page")
	page, err := strconv.ParseInt(pageParam, 10, 64)
	if err != nil {
		page = 0
	}

	users, count, err := models.GetUsers(page)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"users": users,
		"count": count,
		"page":  page,
	})
}

type createServiceAccountRequestBody struct {
	Username string
}

func CreateServiceAccountHandle(c *gin.Context) {
	if _, err := Authenticate(c, models.RoleAdmin); err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "error",
		})

		return
	}

	body, err := parseBody[createServiceAccountRequestBody](c)
	if err != nil {
		return
	}

	userId := primitive.NewObjectID()
	token := createJWT(&userId, models.RoleService)
	user, err := models.CreateServiceAccount(userId, body.Username, token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": user.Token,
	})
}

func parseBody[T any](c *gin.Context) (*T, error) {
	var body T
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid body",
		})

		return nil, err
	}

	return &body, nil
}

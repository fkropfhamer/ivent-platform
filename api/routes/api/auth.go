package api

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"networking-events-api/models"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

const secret = "1234"

func createJWT() string {
	claims := jwt.MapClaims{
		"test": "123",
		"iat":  time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))

	if err != nil {
		log.Fatal(err)

		return ""
	}

	return tokenString
}

func Authenticate(c *gin.Context) (*models.User, error) {
	tokenString, err := extractToken(c)

	if err != nil {
		return nil, errors.New("no token")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(secret), nil
	})

	if err != nil {
		return nil, errors.New("invalid token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return &models.User{
			Id:   primitive.NewObjectID(),
			Name: claims["test"].(string),
		}, nil
	}

	return nil, errors.New("invalid token")
}

func extractToken(c *gin.Context) (string, error) {
	bearerToken := c.Request.Header.Get("Authorization")

	token := strings.Split(bearerToken, " ")

	if len(token) == 2 {
		return token[1], nil
	}

	return "", errors.New("no token")
}

func LoginHandle(c *gin.Context) {
	token := createJWT()

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

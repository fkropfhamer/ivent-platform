package api

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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

func LoginHandle(c *gin.Context) {
	token := createJWT()

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}

package api

import (
	"context"
	"errors"
	"fmt"
	"ivent-api/config"
	"ivent-api/db"
	"ivent-api/models"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func createJWT(userID *primitive.ObjectID, role models.Role) string {
	claims := jwt.MapClaims{
		"id":   userID.Hex(),
		"iat":  time.Now().Unix(),
		"role": role,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.Secret))

	if err != nil {
		return ""
	}

	return tokenString
}

func hasRole(userRole models.Role, requiredRole models.Role) bool {
	if userRole == requiredRole {
		return true
	}

	if userRole == models.RoleUser && requiredRole == models.RoleService {
		return true
	}

	if userRole == models.RoleAdmin {
		return true
	}

	return false
}

func Authenticate(c *gin.Context, requiredRole models.Role) (*models.User, error) {
	tokenString, err := extractToken(c)

	if err != nil {
		return nil, errors.New("no token")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(config.Secret), nil
	})

	if err != nil {
		return nil, errors.New("invalid token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		role := models.Role(claims["role"].(string))
		if role != models.RoleService {
			iat := int64(claims["iat"].(float64)) // I don't know why it is a float but ok.
			if iat+config.TokenLifetime < time.Now().Unix() {
				return nil, errors.New("token expired")
			}
		}

		userId := claims["id"].(string)
		userObjectId, err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			return nil, errors.New("invalid id")
		}

		user, err := models.GetUser(&userObjectId)
		if err != nil {
			return nil, err
		}

		if !hasRole(user.Role, requiredRole) {
			return nil, errors.New("wrong role")
		}

		if user.Role == models.RoleService && user.Token != tokenString {
			return nil, errors.New("wrong token")
		}

		return user, nil
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

type loginRequestBody struct {
	Username string
	Password string
}

func LoginHandle(c *gin.Context) {
	var body loginRequestBody

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid body",
		})

		return
	}

	var user models.User
	filter := bson.M{"name": body.Username}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.UserCollection.FindOne(ctx, filter).Decode(&user); err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "bad username or password",
		})

		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(http.StatusForbidden, gin.H{
			"message": "bad username or password",
		})

		return
	}

	token := createJWT(&user.Id, user.Role)
	refreshToken, err := models.CreateRefreshToken(&user.Id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"messsage": "something went wrong",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token":         token,
		"refresh-token": refreshToken,
		"role":          user.Role,
	})
}

func CheckPassword(id *primitive.ObjectID, password string) error {
	var user models.User
	filter := bson.M{"_id": id}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := db.UserCollection.FindOne(ctx, filter).Decode(&user); err != nil {
		return err
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	return err
}

func RefreshHandle(c *gin.Context) {
	refreshToken := c.Request.Header.Get("Refresh")

	if refreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "refresh header not present",
		})

		return
	}

	dbToken, err := models.GetRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "token does not exist",
		})

		return
	}

	if dbToken.IAT+config.RefreshLifetime < time.Now().Unix() {
		models.DeleteRefreshToken(dbToken.ID)

		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "token expired",
		})

		return
	}

	user, err := models.GetUser(&dbToken.User)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "user does not exist",
		})

		return
	}

	token := createJWT(&dbToken.User, user.Role)

	c.JSON(http.StatusOK, gin.H{
		"token": token,
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

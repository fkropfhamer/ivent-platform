package api

import (
	"errors"
	"ivent-api/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ProfileHandle(c *gin.Context) {
	user, err := Authenticate(c, models.RoleUser)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":  "profile",
		"username": user.Name,
		"id":       user.Id,
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user created",
	})
}

type createUserByAdminRequestBody struct {
	Username string
	Password string
	Role     models.Role
}

func CreateUserByAdminHandle(c *gin.Context) {
	_, err := Authenticate(c, models.RoleAdmin)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error with id: ${id}",
		})

		return
	}

	var body createUserByAdminRequestBody

	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})
		return
	}

	newUser := models.User{
		Id:   primitive.NewObjectID(),
		Name: body.Username,
		Role: body.Role,
	}

	err = models.CreateUser(&newUser)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "user created",
	})
}

type changeUserByAdminRequestBody struct {
	Id      primitive.ObjectID
	NewRole models.Role
}

func ChangeUserRoleByAdminHandle(c *gin.Context) {
	_, err := Authenticate(c, models.RoleAdmin)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error with id: ${id}",
		})

		return
	}

	var body changeUserByAdminRequestBody
	if err := c.BindJSON(&body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "invalid body",
		})

		return
	}

	if err := models.UpdateUserRole(&body.Id, body.NewRole); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "password updated",
	})
}

type registerRequestBody struct {
	Username string
	Password string
}

func RegisterHandle(c *gin.Context) {
	body, err := parseBody[registerRequestBody](c)
	if err != nil {
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

	if err := validatePassword(body.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": err.Error(),
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

	err = models.CreateUser(&newUser)

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

func isDigit(b byte) bool {
	return b >= 48 && b <= 57
}

func isSpecialCharacter(b byte) bool {
	return !isDigit(b) && (b < 65 || b > 122 || (b >= 91 && b <= 96))
}

func validatePassword(password string) error {
	if len(password) < 12 {
		return errors.New("Password too short")
	}

	digitCount := 0
	specialCharacterCount := 0

	for i := 0; i < len(password); i++ {
		r := password[i]
		if isDigit(r) {
			digitCount++
		}

		if isSpecialCharacter(r) {
			specialCharacterCount++
		}
	}

	if digitCount <= 0 {
		return errors.New("Password should contain atleast one digit")
	}

	if specialCharacterCount <= 0 {
		return errors.New("Password should contain atleast one special character")
	}

	return nil
}

func DeleteUserHandle(c *gin.Context) {
	user, err := Authenticate(c, models.RoleUser)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	if err := models.DeleteUser(&user.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	if err := models.DeleteAllRefreshTokenForUser(&user.Id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "acc deleted",
	})
}

func DeleteUserByAdminHandle(c *gin.Context) {
	id, err := primitive.ObjectIDFromHex(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid id",
		})
		return
	}

	if err := models.DeleteUser(&id); err != nil {
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
	user, err := Authenticate(c, models.RoleUser)
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

	if err := CheckPassword(&user.Id, body.CurrentPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": "invalid password",
		})

		return
	}

	if err := models.UpdatePassword(&user.Id, body.NewPassword); err != nil {
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
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "error",
		})

		return
	}

	pageParam := c.Query("page")
	page, err := strconv.ParseInt(pageParam, 10, 64)
	if err != nil {
		page = 0
	}

	filter := bson.M{}

	roleParam := c.Query("role")
	if roleParam != "" {

		role, err := models.RoleFromString(roleParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "invalid role param",
			})

			return
		}

		filter["role"] = bson.M{"$eq": role}
	}

	users, count, err := models.GetUsers(page, filter)

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

package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func A (m string) func(c *gin.Context) {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": m,
		})
	}		
}

func Handle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func NewRouter(handler *gin.Engine) {
	api := handler.Group("/api")
	{
		api.GET("/test", A("test"))
	}

	auth := api.Group("auth")
	{
		auth.GET("/login", A("login"))
	}
}
 
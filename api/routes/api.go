package routes

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"networking-events-api/routes/api"
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
	apiRouter := handler.Group("/api")
	{
		apiRouter.GET("/test", A("test"))

		authRouter := apiRouter.Group("/auth")
		{
			authRouter.GET("/login", api.LoginHandle)
		}
		
		userRouter := apiRouter.Group("/user")
		{
			userRouter.GET("/profile", api.ProfileHandle)
		}
	}	
}
 
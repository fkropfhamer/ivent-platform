package routes

import (
	"net/http"
	"networking-events-api/routes/api"

	"github.com/gin-gonic/gin"
)

func A(m string) func(c *gin.Context) {
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
			authRouter.POST("/login", api.LoginHandle)
		}

		userRouter := apiRouter.Group("/users")
		{
			userRouter.GET("/profile", api.ProfileHandle)
			userRouter.POST("/", api.CreateUserHandle)
			userRouter.POST("/register", api.RegisterHandle)
		}

		eventRouter := apiRouter.Group("/events")
		{
			eventRouter.POST("/", api.CreateEventHandler)
		}
	}
}

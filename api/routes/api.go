package routes

import (
	"net/http"
	"networking-events-api/routes/api"

	"github.com/gin-gonic/gin"
)

func Handle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

func NewRouter(handler *gin.Engine) {
	apiRouter := handler.Group("/api")
	{
		authRouter := apiRouter.Group("/auth")
		{
			authRouter.POST("/login", api.LoginHandle)
			authRouter.GET("/refresh", api.RefreshHandle)
		}

		userRouter := apiRouter.Group("/users")
		{
			userRouter.GET("/profile", api.ProfileHandle)
			userRouter.POST("", api.CreateUserHandle)
			userRouter.POST("/register", api.RegisterHandle)
		}

		eventRouter := apiRouter.Group("/events")
		{
			eventRouter.POST("", api.CreateEventHandler)
			eventRouter.GET("/:id", api.GetEventHandler)
			eventRouter.GET("", api.ListEventsHandler)
		}
	}
}

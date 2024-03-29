package routes

import (
	"ivent-api/routes/api"
	"net/http"

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
			userRouter.POST("/create", api.CreateUserByAdminHandle)
			userRouter.PUT("/change-role", api.ChangeUserRoleByAdminHandle)
			userRouter.POST("/register", api.RegisterHandle)
			userRouter.DELETE("/profile", api.DeleteUserHandle)
			userRouter.POST("/change-password", api.ChangePasswordHandle)
			userRouter.GET("", api.ListUsersHandle)
			userRouter.POST("/service", api.CreateServiceAccountHandle)
			userRouter.DELETE("/:id", api.DeleteUserByAdminHandle)
		}

		eventRouter := apiRouter.Group("/events")
		{
			eventRouter.POST("", api.CreateEventHandler)
			eventRouter.GET("/:id", api.GetEventHandler)
			eventRouter.DELETE("/:id", api.DeleteEventHandler)
			eventRouter.GET("", api.ListEventsHandler)
			eventRouter.PUT("/:id/mark", api.MarkEventHandler)
			eventRouter.PUT("/:id/unmark", api.UnMarkEventHandler)
		}
	}
}

package api

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func LoginHandle(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

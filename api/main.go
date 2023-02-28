package main

import (
	"github.com/gin-gonic/gin"
	"networking-events-api/routes"
)

func main() {
	r := gin.Default()
	r.GET("/ping", routes.Handle)

	routes.NewRouter(r)

	r.Run()
}
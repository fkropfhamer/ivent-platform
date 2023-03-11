package main

import (
	"networking-events-api/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()
	r.GET("/ping", routes.Handle)

	PopulateDb()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowHeaders = []string{"authorization", "content-type", "refresh"}
	corsConfig.AllowAllOrigins = true
	r.Use(cors.New(corsConfig))

	routes.NewRouter(r)

	r.Run()
}

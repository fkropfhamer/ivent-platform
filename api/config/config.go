package config

import "os"

func getEnv(key string, defaultValue string) string {
	env := os.Getenv(key)
	if env == "" {
		return defaultValue
	}

	return env
}

var DbUrl = getEnv("DB_URL", "mongodb://localhost:27017")
var Secret = getEnv("SECRET", "1234")

const RefreshLifetime = 60 * 10
const TokenLifetime = 60 * 5
const DbName = "events"

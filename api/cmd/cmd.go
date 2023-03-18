package main

import (
	"fmt"
	"os"
)

func runCommand(args []string) {

	commandArgs := args[1:]

	fmt.Println(commandArgs)

	switch command := args[0]; command {
	case "fixtures":
		LoadFixtures()
	case "clean-db":
		CleanDB()
	case "create-user":
		CreateUser()
	default:
		fmt.Println("Command not found")
	}
}

func main() {
	args := os.Args[1:]

	runCommand(args)
}

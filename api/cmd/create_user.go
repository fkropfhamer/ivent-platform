package main

import (
	"bufio"
	"fmt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"ivent-api/models"
	"os"
	"strings"
	"syscall"

	"golang.org/x/term"
)

func CreateUser() {
	username, password, err := getCredentials()
	if err != nil {
		fmt.Print("Something went wrong :(")
		return
	}

	fmt.Printf("Username: %s, Password: %s\n", username, password)

	user := models.User{
		Id:       primitive.NewObjectID(),
		Name:     username,
		Password: password,
	}

	if err := models.CreateUser(&user); err != nil {
		fmt.Println("Something went wrong 😭")
		return
	}

	fmt.Printf("User %s was succesfully created \n", username)
}

// https://stackoverflow.com/a/32768479/14280311 thank you! 🙏
func getCredentials() (string, string, error) {
	reader := bufio.NewReader(os.Stdin)

	fmt.Print("Enter Username: ")
	username, err := reader.ReadString('\n')
	if err != nil {
		return "", "", err
	}

	fmt.Print("Enter Password: ")
	bytePassword, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		return "", "", err
	}

	password := string(bytePassword)
	return strings.TrimSpace(username), strings.TrimSpace(password), nil
}

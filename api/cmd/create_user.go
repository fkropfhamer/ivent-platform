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

	role, err := getRole()
	if err != nil {
		fmt.Print("Something went wrong :(")
		return
	}

	user := models.User{
		Id:       primitive.NewObjectID(),
		Role:     role,
		Name:     username,
		Password: password,
	}

	if err := models.CreateUser(&user); err != nil {
		fmt.Println("Something went wrong 😭")
		return
	}

	fmt.Printf("User %s with Role %s was succesfully created \n", username, role)
}

func getRole() (models.Role, error) {
	reader := bufio.NewReader(os.Stdin)
	fmt.Println("[0] RoleUser, [1] RoleAdmin")
	fmt.Print("Choose Role: ")
	roleIndex, err := reader.ReadString('\n')
	if err != nil {
		return "", err
	}

	if strings.TrimSpace(roleIndex) == "1" {
		return models.RoleAdmin, nil
	}

	return models.RoleUser, nil
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

package api

import (
	"ivent-api/models"
	"testing"
)

type hasRoleTests struct {
	userRole, requiredRole models.Role
	expected               bool
}

func TestHasRole(t *testing.T) {
	testCases := []hasRoleTests{
		{models.RoleUser, models.RoleUser, true},
		{models.RoleAdmin, models.RoleAdmin, true},
		{models.RoleUser, models.RoleAdmin, false},
		{models.RoleAdmin, models.RoleUser, true},
	}

	for _, testCase := range testCases {
		if result := hasRole(testCase.userRole, testCase.requiredRole); result != testCase.expected {
			t.Fatalf(`Expected hasRole to be %t for (%s, %s) but got %t`, testCase.expected, testCase.userRole, testCase.requiredRole, result)
		}
	}
}

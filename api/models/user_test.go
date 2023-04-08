package models

import "testing"

func TestRoleFromString(t *testing.T) {

	tests := []struct {
		name    string
		arg     string
		want    Role
		wantErr bool
	}{
		{"admin", "ROLE_ADMIN", RoleAdmin, false},
		{"admin_lower", "role_admin", RoleAdmin, false},
		{"admin_mix", "rOlE_AdmIn", RoleAdmin, false},
		{"admin_fail", "admin", "", true},
		{"user", "ROLE_USER", RoleUser, false},
		{"user_lower", "role_user", RoleUser, false},
		{"user_mix", "Role_User", RoleUser, false},
		{"user_fail", "user", "", true},
		{"service", "ROLE_SERVICE", RoleService, false},
		{"service_lower", "role_service", RoleService, false},
		{"service_mix", "rolE_servicE", RoleService, false},
		{"service_fail", "service", "", true},
		{"empty", "", "", true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := RoleFromString(tt.arg)
			if (err != nil) != tt.wantErr {
				t.Errorf("RoleFromString() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("RoleFromString() got = %v, want %v", got, tt.want)
			}
		})
	}
}

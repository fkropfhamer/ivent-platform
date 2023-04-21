package api

import "testing"

func Test_validatePassword(t *testing.T) {

	tests := []struct {
		name    string
		args    string
		wantErr bool
	}{
		{"too short", "123", true},
		{"no digit", "abcderfghijkl@", true},
		{"no special character", "abcdefghijklmn1234", true},
		{"no special character and no digit", "abcdedfghijklmnopqrst", true},
		{"valid", "abcdefghiklmo$&123", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if err := validatePassword(tt.args); (err != nil) != tt.wantErr {
				t.Errorf("validatePassword() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func Test_isSpecialCharacter(t *testing.T) {
	tests := []struct {
		name string
		args byte
		want bool
	}{
		{"not special", 'a', false},
		{"special", '&', true},
		{"digit", '1', false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isSpecialCharacter(tt.args); got != tt.want {
				t.Errorf("isSpecialCharacter() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_isDigit(t *testing.T) {
	tests := []struct {
		name string
		args byte
		want bool
	}{
		{"digit", '1', true},
		{"special", ')', false},
		{"no digit", 'z', false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := isDigit(tt.args); got != tt.want {
				t.Errorf("isDigit() = %v, want %v", got, tt.want)
			}
		})
	}
}

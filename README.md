# events
## getting started
### db
- `docker compose up -d`
### api
- `cd api`
- `go run .`
- api available at http://localhost:8080
### web
- `cd web`
- `npm run dev`
- available at http://localhost:5173

## Commands
run with `go run ./cmd [command]`

Available commands:
- `fixtures` load fixtures
- `clean-db` cleans db
- `create-user` prompt to create user

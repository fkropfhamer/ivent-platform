web_dev:
	npm run --prefix web dev
web_init:
	npm ci --prefix web
api_dev:
	cd api && go run .
api_fixtures:
	cd api && go run ./cmd fixtures

service:=app

.PHONY: build
build:
	docker-compose build
	docker-compose run --rm --no-deps app yarn

.PHONY: start
start:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: lint
lint:
	docker-compose run --rm --no-deps app yarn lint

.PHONY: remove
remove:
	docker-compose rm

.PHONY: logs
logs:
	docker-compose logs -f $(service)

.PHONY: test
test:
	docker-compose run --rm --no-deps app yarn test

# dependency management
.PHONY: add-dependency
add-dependency:
	docker-compose run --rm --no-deps app yarn add $(dependency)

.PHONY: add-dev-dependency
add-dev-dependency:
	docker-compose run --rm --no-deps app yarn add -D $(dependency)

.PHONY: rm-dependency
rm-dependency:
	docker-compose run --rm --no-deps app yarn remove $(dependency)

.PHONY: clear-dependencies
clear-dependencies:
	docker-compose run --rm --no-deps app rm -rf node_modules

.PHONY: connect-mongo
connect-mongo:
	docker-compose exec mongo mongo --host mongo

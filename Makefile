service:=app

.PHONY: add-dependency
add-dependency:
	docker-compose run --rm --no-deps $(service) yarn add $(dependency)

.PHONY: add-dev-dependency
add-dev-dependency:
	docker-compose run --rm --no-deps $(service) yarn add -D $(dependency)

.PHONY: build
build:
	docker-compose build
	docker-compose run --rm --no-deps $(service) yarn

.PHONY: clear-dependencies
clear-dependencies:
	docker-compose run --rm --no-deps $(service) rm -rf node_modules

.PHONY: compile
compile:
	docker-compose run --rm --no-deps $(service) yarn compile

.PHONY: connect-mongo
connect-mongo:
	docker-compose exec mongo mongo --host mongo

.PHONY: lint
lint:
	docker-compose run --rm --no-deps $(service) yarn lint

.PHONY: logs
logs:
	docker-compose logs -f $(service)

.PHONY: remove
remove:
	docker-compose rm

.PHONY: rm-dependency
rm-dependency:
	docker-compose run --rm --no-deps $(service) yarn remove $(dependency)

.PHONY: start
start:
	docker-compose up -d

.PHONY: stop
stop:
	docker-compose down

.PHONY: test-integration
test-integration:
	docker-compose run --rm $(service) yarn test:integration

.PHONY: test-unit
test-unit:
	docker-compose run --rm --no-deps $(service) yarn test:unit

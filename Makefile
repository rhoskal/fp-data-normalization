# Build configuration
# -------------------

APP_NAME = `node -p "require('./package.json').name"`
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`
GIT_REVISION = `git rev-parse HEAD`

# Introspection targets
# ---------------------

.PHONY: help
help: header targets

.PHONY: header
header:
	@echo "\033[34mEnvironment\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@printf "\033[33m%-23s\033[0m" "APP_NAME"
	@printf "\033[35m%s\033[0m" $(APP_NAME)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_BRANCH"
	@printf "\033[35m%s\033[0m" $(GIT_BRANCH)
	@echo ""
	@printf "\033[33m%-23s\033[0m" "GIT_REVISION"
	@printf "\033[35m%s\033[0m" $(GIT_REVISION)
	@echo "\n"

.PHONY: targets
targets:
	@echo "\033[34mTargets\033[0m"
	@echo "\033[34m---------------------------------------------------------------\033[0m"
	@perl -nle'print $& if m{^[a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'

# Development targets
# -------------------

.PHONY: build
build: ## Make a production build
	yarn react-scripts build

.PHONY: clean
clean: ## Remove build artifacts
	rm -rf build

.PHONY: compile
compile: ## Run TypeScript compiler
	yarn tsc

.PHONY: coverage
coverage: ## Run tests and get coverage
	yarn react-scripts test --watchAll=false --ci --coverage

.PHONY: deps
deps: ## Install all dependencies
	yarn install

.PHONY: format
format: format-css format-js ## Format everything

.PHONY: format-css
format-css: ## Format stylesheets
	yarn prettier --write 'src/**/*.{css,scss}'

.PHONY: format-js
format-js: ## Format js
	yarn prettier --write 'src/**/*.{ts,tsx}'

.PHONY: lint
lint: ## Lint code
	yarn eslint 'src/**/*.{ts,tsx}' --fix

.PHONY: run
run: ## Run web app
	HTTPS=true BROWSER=none yarn react-scripts start

.PHONY: test
test: ## Run tests
	yarn react-scripts test

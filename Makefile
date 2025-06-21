# ---------- CONFIG -------------------------------------------------------
SHELL := /bin/bash            # we use brace-group + trap

ENV_FILE     ?= $(CURDIR)/.env.local
COMPOSE_YML   = -f docker-compose.yaml -f docker-compose.dev.yaml
COMPOSE       = docker-compose $(COMPOSE_YML) --env-file $(ENV_FILE)
GRADLE        = ./gradlew
# ------------------------------------------------------------------------

.PHONY: dev up down clean logs api stream web

## -----------------------------------------------------------------------
## Containers
## -----------------------------------------------------------------------
up:              ## start Postgres & Redis for dev
	$(COMPOSE) up -d db redis

down:            ## stop all compose containers
	$(COMPOSE) down

clean:           ## stop + delete volumes/networks
	$(COMPOSE) down -v --remove-orphans

logs:            ## follow container logs
	$(COMPOSE) logs -f

## -----------------------------------------------------------------------
## Individual long-running services (no colour here)
## -----------------------------------------------------------------------
api:
	cd api && ENV_FILE="$(ENV_FILE)" $(GRADLE) --console=plain run

stream:
	cd streaming && bun dev

web:
	cd website && bun dev

## -----------------------------------------------------------------------
## Full dev stack: containers first, then api/stream/web in parallel
## with colour-tagged, live logs
## -----------------------------------------------------------------------
dev: up
	@echo "🚀  Starting local services (api, stream, web)…";\
	{ \
	  $(MAKE) --no-print-directory api    \
	    | awk '{printf "\033[36m[api]\033[0m %s\n", $$0}'    & \
	  $(MAKE) --no-print-directory stream \
	    | awk '{printf "\033[35m[stream]\033[0m %s\n", $$0}' & \
	  $(MAKE) --no-print-directory web    \
	    | awk '{printf "\033[32m[web]\033[0m %s\n", $$0}'    & \
	  trap 'echo; echo "👋  Stopping…"; kill 0' INT TERM ;\
	  wait ;\
	}


path    ?= $(shell pwd)
token   ?= ...

example ?= transport-state

# -----------------------------------------------------------------------------

# Develop

build-dev:
	cd ${path}/examples/${example} && \
	rm -rf node_modules && \
	npm install --production

run-dev:
	cd ${path}/examples/${example} && \
	vercel dev --token ${token}

# -----------------------------------------------------------------------------

# Deploy

deploy:
	cd ${path}/examples/${example} && \
	vercel --prod --token ${token}

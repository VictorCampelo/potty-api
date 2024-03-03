#!/bin/sh

./scripts/wait-for-it.sh -t 0 potty-db:5432

yarn typeorm:run-migrations

# yarn typeorm migration:run

if [ "${NODE_ENV}" = 'test' ]; then
	echo "Running Test";
	yarn test
else 
	echo "Running Dev Mode"
    yarn dev
fi

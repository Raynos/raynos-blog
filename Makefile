REPORTER = spec
TEST_COMMAND = @NODE_ENV=test \
	./node_modules/.bin/mocha \
	--ui bdd \
	--ignore-leaks \
	--reporter $(REPORTER) \
	--recursive \
	
start:
	nodemon \
		--watch ./modules \
		--watch ./lib \
		--watch ./node_modules \
		--watch ./templates \
		core.js

test-http:
	$(TEST_COMMAND) ./tests/http

test-zombie:
	$(TEST_COMMAND) ./tests/zombie

test:
	make test-http

.PHONY: start test-http test
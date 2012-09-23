start:
	@DEBUG=http \
		nodemon \
		--watch ./node_modules \
		--watch ./posts
		index.js
.PHONY: build dev prod clean

build:
	npm run build

dev:
	npm run dev

prod: build
	npm run pack

clean:
	rm -rf dist release

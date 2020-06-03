run :
	cd ./web-app; npm run build
	npm start

build :
	cd ./web-app; npm install; npm run build
	npm install

clean :
	rm -rf ./node_modules ./web-app/node_modules package-lock.json ./web-app/package-lock.json ./web-app/dist

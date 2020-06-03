default :
	make build
	make run

install :
	cd ./web-app; npm install;
	npm install

build :
	cd ./web-app; npm run build

run :
	npm start

clean :
	rm -rf ./node_modules ./web-app/node_modules package-lock.json ./web-app/package-lock.json ./web-app/dist

run :
	cd ./web-app; npm run build
	npm start

fresh :
	make clean
	make install
	make run

install :
	cd ./web-app; npm install
	npm install

clean :
	rm -rf ./node_modules ./web-app/node_modules package-lock.json ./web-app/package-lock.json ./web-app/dist

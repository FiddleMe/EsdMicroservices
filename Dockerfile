FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
# RUN npm ci --omit=dev
COPY . .
CMD [ "node", "server.js" ]
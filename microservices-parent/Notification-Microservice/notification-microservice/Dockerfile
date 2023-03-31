FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
# RUN npm ci --omit=dev
COPY . .
EXPOSE 4002
EXPOSE 5672
EXPOSE 15672
CMD [ "node", "index.js" ]
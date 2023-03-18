FROM node:18.15.0-alpine
WORKDIR /app
COPY C:\Users\tiffa\Documents\GitHub\EsdMicroservices\signup_login
RUN npm install
EXPOSE 5000
CMD [ "npm", "start" ]

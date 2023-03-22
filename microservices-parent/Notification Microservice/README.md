Setup rabbitmq
1. Open Docker desktop
2. ```sh
    docker pull rabbitmq:3-management
    ```
3. ```sh
   docker run --rm -it -p 15672:15672 -p 5672:5672 rabbitmq:3-management
   ```
4. rabbitmq should be available on http://localhost:15672

Message microservice
1. cd to /message microservice
2. ```sh
   npm install
   ```

3. ```sh
    node index.js
    ```
4. message microservice should be available on http://localhost:4002

test message 
1. cd to /test-sender message microservice
2. ```sh
   npm install
   ```

3. ```sh
    node index.js
    ```
4. test-message service should be available on http://localhost:4001

To Test
1. open http://localhost:4001/send-msg on browser
2. Browser should display `message sent`
3. cmd/terminal at message microservice should log: `Email sent: 250 2.0.0 OK`
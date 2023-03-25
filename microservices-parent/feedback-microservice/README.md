1. First, import all the SQL scripts; start with the scripts for the database and table and then import the script for all the test data. All the SQL scripts can be found in the folder named "sql scripts".

2. Then, in VS Code Terminal (make sure directory is set to .../microservices-parent/feedback-microservice), run: 
    docker build -t <dockerid>/feedback:1.0 ./ 
Make sure to change <dockerid> to your docker ID.

3. Then, in VS Code Terminal, run:
    docker run -p 5001:5001 -e dbURL=mysql+pymysql://root:root@host.docker.internal:3306/feedback <dockerid>/feedback:1.0
You may use mysqlconnector instead of pymysql. Additionally, root:root may need to be changed to just root instead for Windows users (without changes, the given command works for Mac)

4. To test, open 127.0.0.1:5001/feedback. A JSON string with all the feedback in the feedback table should be displayed in your browser.
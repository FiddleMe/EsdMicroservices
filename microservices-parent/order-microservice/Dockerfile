FROM eclipse-temurin:17
VOLUME /tmp
ARG JAR_FILE
COPY ./target/order-microservice-0.0.1-SNAPSHOT.jar order-microservice-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","order-microservice-0.0.1-SNAPSHOT.jar"]
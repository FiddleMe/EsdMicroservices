FROM eclipse-temurin:17
VOLUME /tmp
ARG JAR_FILE

WORKDIR /usr/src/app
COPY target/product-service-0.0.1-SNAPSHOT.jar /app/product.jar
ENTRYPOINT ["java", "-jar", "/app/product.jar"]
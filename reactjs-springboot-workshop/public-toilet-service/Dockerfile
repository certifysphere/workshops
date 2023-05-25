FROM adoptopenjdk/openjdk11:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the JAR file from the target directory into the container
COPY ./target/public-toilet-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Specify the command to run the Spring app
ENTRYPOINT ["java", "-jar", "app.jar"]

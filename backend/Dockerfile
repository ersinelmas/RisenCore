# --- Build Stage ---
# Use an official OpenJDK runtime as a parent image for building
# The 'eclipse-temurin' images are a good, community-supported choice for OpenJDK
FROM eclipse-temurin:17-jdk-jammy as builder

# Set the working directory inside the image
WORKDIR /app

# Copy the Maven wrapper and pom.xml to leverage Docker cache layers
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Download dependencies
# RUN ./mvnw dependency:go-offline
# This step is optional but can speed up subsequent builds if dependencies don't change

# Copy the rest of the source code
COPY src ./src

# Package the application, skipping tests
RUN ./mvnw package -DskipTests

# --- Run Stage ---
# Use a smaller JRE image for the final container to reduce size
FROM eclipse-temurin:17-jre-jammy

# Set the working directory
WORKDIR /app

# Set an argument for the JAR file path
ARG JAR_FILE=target/*.jar

# Copy the JAR file from the builder stage
COPY --from=builder /app/${JAR_FILE} application.jar

# Expose the port the app runs on
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "application.jar"]
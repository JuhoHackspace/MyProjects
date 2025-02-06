# Stage 1: Build the Spring Boot JAR
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy only necessary files for faster builds
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN apk add --no-cache maven && mvn dependency:go-offline

COPY src src
RUN mvn clean package -DskipTests

# Stage 2: Run the Spring Boot Application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose correct port
EXPOSE 8080

# Start the Spring Boot app
CMD ["java", "-jar", "app.jar"]
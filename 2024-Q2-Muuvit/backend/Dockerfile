FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN apk add maven && mvn package
COPY target/*.jar .

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=build /app/*jar .
#COPY --from=build /app/entrypoint.sh .
EXPOSE 3000

ENTRYPOINT find . -name backend\*.jar|head -n 1|xargs java -jar
#ENTRYPOINT ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]

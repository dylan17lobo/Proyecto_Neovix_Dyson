<<<<<<< HEAD:ndynsrny/ndynsrny/BACKEND - Version 1.1/Dockerfile
FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

COPY src/ src/
RUN ./mvnw clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

USER spring:spring

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
=======
# Fase 1: Compilación
FROM maven:3.9.6-eclipse-temurin-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Fase 2: Ejecución
FROM eclipse-temurin:17-jre-jammy
COPY --from=build /target/*.jar app.jar

# Exponer puerto y limitar la RAM a 300MB para que Render no lo tumbe 
EXPOSE 8080 
CMD ["java", "-Xmx300m", "-Xms300m", "-jar", "app.jar"]
>>>>>>> 0998dfb83ad59437ad4033bcf55ed13e813e7355:ndynsrny/ndynsrny/backend/Dockerfile

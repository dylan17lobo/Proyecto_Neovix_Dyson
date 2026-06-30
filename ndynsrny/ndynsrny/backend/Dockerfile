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
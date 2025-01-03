FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar service-departement.jar
EXPOSE 9090
ENTRYPOINT ["java","-jar","service-departement.jar"]
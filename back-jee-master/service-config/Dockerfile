FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar service-config.jar
EXPOSE 8089
ENTRYPOINT ["java","-jar","service-config.jar"]
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar server-gateway.jar
EXPOSE 8888
ENTRYPOINT ["java","-jar","server-gateway.jar"]
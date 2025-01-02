FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar service-examen.jar
EXPOSE 9091
ENTRYPOINT ["java","-jar","service-examen.jar"]
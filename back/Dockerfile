# 1. 빌드 단계 (Gradle 프로젝트)
FROM gradle:8.7-jdk17 AS builder
WORKDIR /app
COPY . .
RUN gradle clean bootJar --no-daemon

# 2. 실행 단계
FROM eclipse-temurin:17-jdk
WORKDIR /app

# spring multipart 임시 디렉토리 생성
RUN mkdir -p /tmp/spring-multipart-temp
RUN chmod a+rwx /tmp/spring-multipart-temp

ENV JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8"
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-Xms512m","-Xmx1024m","-jar","app.jar"]
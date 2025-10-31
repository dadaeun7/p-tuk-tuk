plugins {
	java
	id("org.springframework.boot") version "3.4.7"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.server"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral();
	google();
}

dependencies {

	//WebClient
	implementation("org.springframework.boot:spring-boot-starter-webflux")

	// Kotlin & Spring Boot Core
	implementation("org.springframework.boot:spring-boot-starter")

	// Web (REST API)
	implementation("org.springframework.boot:spring-boot-starter-web")

	// AOP
	implementation("org.springframework.boot:spring-boot-starter-aop")

	// Parser
	implementation("org.jsoup:jsoup:1.21.2")

	// Mail
	implementation("org.springframework.boot:spring-boot-starter-mail")
	
	// External Connect Service
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
	implementation("org.springframework.boot:spring-boot-starter-security")

	// Validation
	implementation("org.springframework.boot:spring-boot-starter-validation")

	// JPA
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("mysql:mysql-connector-java:8.0.33")

	// Redis
	implementation("org.springframework.boot:spring-boot-starter-data-redis")

	// JWT
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")

	//BOM
	implementation(platform("com.google.cloud:libraries-bom:26.40.0"))

	//Spring Retry
	implementation("org.springframework.retry:spring-retry")

	//Gemini(Google AI) API 
	implementation("com.google.cloud:google-cloud-vertexai") //:1.5.0 << BOM 자동 호환 버전 관리
	implementation("com.google.protobuf:protobuf-java:3.25.3")

	//Vision API
	implementation("com.google.cloud:google-cloud-vision:3.46.0")

	//Google Cloud Storage
	implementation("com.google.cloud:google-cloud-storage:2.35.0")

	//google 
    implementation("com.google.api-client:google-api-client:1.31.1") // :2.4.0
	//google oauth 클라이언트(gmail, ouath2 API)
	implementation("com.google.apis:google-api-services-gmail:v1-rev110-1.25.0") // :v1-rev20240520-2.0.0
	implementation("com.google.oauth-client:google-oauth-client-jetty:1.30.6") // :1.34.1
	implementation("com.google.api-client:google-api-client-servlet:2.4.0") 
	// jackson http, api
	implementation("com.google.api-client:google-api-client-jackson2:2.4.0")
	implementation("com.google.http-client:google-http-client-jackson2:1.39.0")
	// jackson > binernate 해석 가능한 의존성
	implementation("com.fasterxml.jackson.datatype:jackson-datatype-hibernate6")

	// 최신 인증 google 인증 라이브러리, OAuth2 (UserInfo) API 라이브러리
	implementation("com.google.auth:google-auth-library-oauth2-http") // :1.19.0 << BOM 자동 호환 버전 관리
	implementation("com.google.apis:google-api-services-oauth2:v2-rev157-1.25.0") 

	//json
	implementation("com.fasterxml.jackson.core:jackson-databind:2.17.1")
	//lombok
	implementation("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	
	// test
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.junit.jupiter:junit-jupiter-api")
	testImplementation("org.mockito:mockito-junit-jupiter:5.8.0")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

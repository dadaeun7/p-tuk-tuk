#rebuild-spring.ps1
Write-Host "📦 Spring Boot jar 빌드 시작..."
D:
# cd ...
./gradlew clean bootJar

Write-Host "🐳 Docker Compose로 Spring 서비스 재빌드 & 재시작..."
cd ..
docker compose up -d --build spring

Write-Host "📜 Spring 로그 확인 (마지막 50줄)"
docker compose logs --tail=50 spring
# 편리하게 추천하여, 깨끗한 지구를 향한 한걸음 가는 TUKTUK
---
### 🌏목적 및 동기
환경 문제와 온라인 쇼핑 주문이 많아지면서 다양한 쓰레기들이 발생하고 있습니다.

번거로워서 쓰레기들을 분리배출 하지 않는 경우 보다 의외로 배출 기준과 다른 방법으로 배출하는 분들도 있습니다.

내 손을 거쳐가는 물건들에 정확한 분리배출 방법을 추천하여 사용자 또한 올바른 배출 방법을 통해 배출하고,

환경에 도움이 될 수 있는 서비스를 만들고자 개발하게 되었습니다.

### 🔑핵심 기능 요약
1. Google 연동으로 Gmail 중 주문(**`배민 장보기`**, **`컬리`**, **`쿠팡`**)을 파싱하여 주문한 상품의 분리배출 방법 추천
2. **`PNG`**, **`JPG`** 을 OCR 통해 주문 상품 분리배출 방법 추천
3. 자신의 지역에 맞는 분리배출 요일 및 방법 추천
4. 총 발생한 수거품에서 배출하기 기능으로 배출 수치를 월별, 대시보드 통해 제공

## 2. 핵심 기술 스택
### 📦 Back-end & Database
**Spring Boot 3.4.7** : 분리수거 물품 추천 결과에 대한 내용에 대해 대규모 트랜잭션 처리가 가능하고, 배출 규칙을 모듈화하여 관리합니다.

**MySQL 8.0** : 관계형 데이터베이스의 무결성을 통해 `품목`<->`매칭키워드`<->`분리수거물품`을 복잡하게 연결하여 데이터를 일관성 있게 관리합니다.

**Redis 7** : Jwt Token 의 Refresh Token 저장과, 분리수거 물품 매칭에 핵심적인 `Entity` 를 `Redis`에 `Cache`로 저장하여 DB I/O 비용을 줄였습니다.



### 📦 React
**React + TypeScript** : 컴포넌트 기반 UI 개발과 다양한 라이브러리와 함께 정적 타입 체크를 통한 안정적인 코드 작성을 위해 사용했습니다.

**Vite** : 모던 빌드 환경을 구축하여 빠른 개발 서버와 최적화된 빌드 성능을 확보하여 개발하기 위해 사용했습니다.



### 📦 Infrastructure & DevOps
**Docker** : Mysql, Redis, Spring 으로 구성된 다중 서비스 환경을 Docker-compose로 단일화 하여 실행에 복잡함이 없도록 했습니다.

**Railway, Vercel** : Railway 를 사용하여 Docker 를 안정적으로 호스팅하고, Vercel 을 통해 React를 빠르게 제공합니다.



## 3. 아키텍처
![프로젝트 시스템 아키텍처](docs/image/tuktuk_아키텍처_1.png)
![프로젝트 시스템 아키텍처](docs/image/tuktuk_아키텍처_2.png)

## 4. ERD
![프로젝트 ERD](docs/image//tuktuk_ERD.png)

## 5. 트러블 슈팅과 기술 결정 과정
* [React_UI_Spring_Security_외부_연동_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/React_UI_Spring_Security_external_connect.html)
* [이메일_인증_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/email_confirm.html)
* [docker_mysql_한글깨짐_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/docker_mysql_ko_error.html)
* [google_외부서비스_연동_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/google_connect.html)
* [Redis_캐싱_JPA_영속성_충돌_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/Redis_caching_JPA_error.html)
* [캐싱_전략_최적화_Hybrid_Model_도입_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/Hybrid_Model.html)
* [JPA_영속성_동시성_Transactional_교착까지_이해와_해결_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/JPA_Transactional_error.html)
* [OAuth2_콜백_URL_매칭_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/ouath2_callback_url_error.html)
* [React_Dexie_동기화_관련_트러블슈팅](https://dadaeun7.github.io/p-tuk-tuk/troubleShooting/React_Dexie_sync.html)

## 6. 앞으로의 목표
✔️ [기능 개선] OCR 로직에 상품명 추출에 안정성 추가

✔️ [기능 개선] 키워드 매칭 서비스 로직 `contain` 에서 Aho-Corasick 알고리즘 도입

✔️ [기능 개선] AI 매칭 순서까지 가지 않도록 item-keyword, keyword-specific 데이터 지속적으로 확보

✔️ [MSA 전환] 매칭 서비스, 이 외 서비스를 Spring 서버 분리하여 Docker container 추가 증설, 분리 운영 

✔️ [신규 기능 추가] 분리수거 물품 데이터 기반 다양한 컨텐츠 제작(미션, 분리수거 물품 배출수에 따른 포인트 제도 등)

✔️ [신규 추가] 모바일 App 출시


# Smart Clean Ashtray

<br/>
<br/>

# 0. Getting Started (시작하기)
```bash
# 1. 서버 인프라 가동 (Docker Compose)
$ cd smart-ashtray
$ cp .env.example .env   # 환경 변수 설정
$ docker compose up -d

# 2. 백엔드 개발 서버 (로컬 실행 시)
$ cd backend
$ pip install -r requirements.txt
$ uvicorn app.main:app --reload --port 8000

# 3. 프론트엔드 개발 서버
$ cd frontend
$ npm install
$ npm run dev

# 4. Flutter 모바일 앱 실행
$ cd flutter_app
$ flutter pub get
$ flutter run
```
*(※ 브라우저 접속: Frontend `http://localhost:3000` / Backend API `http://localhost:8000`)*

<br/>
<br/>

# 1. Project Overview (프로젝트 개요)
- **프로젝트 이름**: Smart Clean Ashtray (스마트 클린 애쉬트레이)
- **프로젝트 설명**: 공공장소·사무공간의 재떨이 상태와 실내 공기질을 실시간으로 관제하는 IoT형 관리 시스템. ESP32 기반 센서 디바이스, MQTT 브로커, FastAPI 서버, React 대시보드, Flutter 모바일 앱을 연결해 "센서 데이터 수집 → 상태 해석 → 원격 제어" 흐름을 구현합니다.

<br/>
<br/>

# 2. Development Background (개발 배경)
- **현장 문제 및 한계**: 재떨이 상태(적재량·공기질)를 관리자가 직접 현장을 방문해야만 파악할 수 있어 즉각적인 대응이 어렵고, 화재 징후 발생 시 초동 대처가 늦어지는 문제가 있습니다.
- **보완 방식**: MQ-135(가스/연기), DHT22(온습도), HC-SR04(적재량 초음파), 플로트 스위치(물탱크) 센서를 조합하여 실시간 상태를 자동 감지하고, 상태 머신(IDLE → SMOKING → WARNING → FIRE_DETECTED) 기반의 자동화된 운영 보조 계층을 구축합니다.

<br/>
<br/>

# 3. Development Objectives (개발 목표)
- **통합 연동**: ESP32 디바이스부터 MQTT 브로커, FastAPI 백엔드, React 웹앱, Flutter 앱까지 일관된 단일 데이터 흐름으로 연결하여 센서 수집부터 원격 제어까지 끊김 없는 시나리오를 검증합니다.
- **역할별 최적화**: 저전력 센서 데이터 수집(IoT), 상태 머신 기반 실시간 제어(임베디드), JWT 다중 인증 기반 REST API 및 WebSocket 실시간 스트림 제공(서버), 반응형 관제 UI(프론트엔드/앱)를 명확한 역할 분리 기준으로 설정합니다.
- **포트폴리오 관점**: IoT/모니터링 서비스의 사용자 흐름을 실제 서비스처럼 설계하고, 프론트엔드·백엔드·모바일 클라이언트가 하나의 제품 흐름 안에서 함께 동작하는 구조를 직접 설계한 경험을 보여줍니다.

<br/>
<br/>

# 4. Team Members (팀원 및 팀 소개)
| 찬 |
|:------:|
| PM / IoT / Backend / Frontend / App |
| [GitHub](https://github.com/) |

<br/>
<br/>

# 5. Key Features (주요 기능)

### 1. 실시간 공기질 모니터링 및 상태 머신 제어
- **5단계 상태 자동 전환**: IDLE(대기) → SMOKING(흡연 감지) → WARNING(화재 위험) → FIRE_DETECTED(화재 진압) / ERROR(물 부족·센서 이상) 상태를 센서값 기반으로 자동 판별합니다.
- **RGB LED·OLED·부저 연동**: 상태별 색상(초록/황색/빨강/보라) 무드 라이팅, OLED 실시간 AQI 수치 표출, 경보음 출력으로 현장 시청각 경보를 제공합니다.

### 2. 펄스 제어(Pulse Control) 자동 소화
- **미세 분무 소화 알고리즘**: 500mL 소형 수조의 한계를 극복하기 위해 "0.5초 미세 분사 → 1초 대기 → 온도/연기 재측정" 펄스 루프를 적용하여 물 소모량을 최소화하고 소화 효율을 극대화합니다.
- **MOSFET 기반 워터펌프 제어**: N채널 MOSFET Low-side Switching + Flyback Diode로 역기전력을 차단하고, 플로트 스위치로 물 부족 시 펌프 Dry-run을 방지합니다.

### 3. 반응형 웹 관제 대시보드
- **768px 기준 반응형 레이아웃**: 모바일(1열 스크롤, 하단 고정 살수 버튼) ↔ 데스크톱(사이드바 + 부스 그리드) 자동 전환
- **실시간 WebSocket 동기화**: 부스 상태 변경 시 React 대시보드에 즉시 반영, 연결 끊김 시 자동 재연결(최대 5회)
- **SVG 반원형 게이지**: 물탱크 잔량·꽁초 적재량을 애니메이션 게이지로 시각화, 80% 이상 시 경고색 자동 전환

### 4. 이메일 인증 기반 회원가입 및 보안 인증
- **3단계 가입 플로우**: 이메일 입력 → Gmail SMTP 인증코드 발송(5분 유효) → 비밀번호 + 개인정보 동의로 단계별 검증
- **JWT 이중 토큰**: Access Token(15분, Bearer) + Refresh Token(7일, HTTP-Only Cookie) 병행으로 웹앱·Flutter 앱 동시 지원
- **보안 5종 일괄 적용**: bcrypt(rounds=12) 비밀번호 해시, bleach XSS 필터, slowapi Rate Limit, CORS 출처 제한, 인증코드 5회 실패 시 즉시 만료

### 5. Flutter 모바일 관제 앱
- **서버 주소 직접 입력**: 로그인 화면에서 VPS IP 또는 도메인을 입력하면 flutter_secure_storage에 저장되어 재빌드 없이 서버 변경 가능 (시연 환경 대응)
- **실시간 부스 그리드**: WebSocket 연결로 부스 상태 카드 즉시 갱신, 적재량 80% 이상 또는 물탱크 고갈 시 카드 테두리 경고색 강조
- **원격 살수 제어**: 확인 다이얼로그 후 POST 명령 전송, 성공/실패 SnackBar 피드백

<br/>
<br/>

# 6. System Architecture (시스템 아키텍처)

```
[ESP32 디바이스]
  MQ-135 / DHT22 / HC-SR04 / 플로트스위치
  WS2812B LED / 워터펌프 / 부저 / OLED
       │ MQTT publish (ashtray/{boothId}/telemetry)
       ▼
[Mosquitto MQTT 브로커]  ← Docker
       │ subscribe
       ▼
[FastAPI 백엔드]          ← Docker
  ├── MQTT 수신 → TimescaleDB 저장
  ├── REST API (JWT 인증)
  ├── WebSocket 실시간 브로드캐스트
  └── 원격 살수 명령 → MQTT publish → ESP32
       │
       ▼
[TimescaleDB]             ← Docker (시계열 센서 데이터)
       │
       ├── [React 웹 대시보드]  ← Docker (Nginx)
       └── [Flutter 모바일 앱] ← VPS REST/WebSocket 연결
```

- **IoT Devices (ESP32)**: MQ-135·DHT22·HC-SR04·플로트스위치로 환경 감지, Wi-Fi 기반 MQTT로 텔레메트리 발행, FreeRTOS 상태 머신으로 LED·펌프·부저 제어
- **MQTT Broker (Mosquitto)**: 포트 1883(MQTT) / 9001(WebSocket), username/password 인증 적용
- **Backend (FastAPI + TimescaleDB)**: 비동기 MQTT 수신 → 시계열 DB 저장 → WebSocket 브로드캐스트, REST API + JWT 인증
- **Frontend (React + Vite)**: Tailwind CSS 반응형, Recharts 시계열 차트, SVG 게이지, WebSocket 실시간 업데이트
- **Mobile (Flutter)**: Riverpod 상태관리, dio + flutter_secure_storage 보안 토큰 관리, fl_chart 차트

<br/>
<br/>

# 7. Why I Built This (왜 이 프로젝트를 만들었는가)

이 프로젝트는 "공공장소·사무공간에서 재떨이 상태와 공기질을 자동으로 확인하고, 이상 징후가 감지되면 즉시 대응할 수 있는 시스템"을 만들고 싶다는 아이디어에서 출발했습니다.

특히 다음 문제를 해결하는 데 초점을 두었습니다.
- 재떨이 상태를 사람이 직접 확인하지 않아도 파악 가능하도록 하기
- 담배 연기·AQI 이상 징후가 발생했을 때 빠르게 인지하도록 하기
- 관리자 관점에서 상태를 한눈에 보고 원격 제어까지 수행할 수 있는 경험 제공하기

또한 이 프로젝트는 단순한 UI 데모가 아니라, 다음 두 가지를 포트폴리오 관점에서 보여주기 위해 구성했습니다.
- IoT/모니터링 서비스의 사용자 흐름을 실제 서비스처럼 설계한 경험
- 프론트엔드, 백엔드, 모바일 클라이언트가 한 프로젝트 안에서 함께 동작하는 구조를 설계한 경험

<br/>
<br/>

# 8. Technology Stack (기술 스택)

### 8.1 IoT & Embedded
![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=for-the-badge&logo=espressif&logoColor=white)
![FreeRTOS](https://img.shields.io/badge/FreeRTOS-00897B?style=for-the-badge&logo=freertos&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-3C525C?style=for-the-badge&logo=mqtt&logoColor=white)
![C++](https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white)

### 8.2 Backend & Infrastructure
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TimescaleDB](https://img.shields.io/badge/TimescaleDB-FDB515?style=for-the-badge&logo=postgresql&logoColor=black)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Mosquitto](https://img.shields.io/badge/Mosquitto-3C525C?style=for-the-badge&logo=eclipsemosquitto&logoColor=white)

### 8.3 Frontend
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### 8.4 Mobile
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)

### 8.5 Auth & Security
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Gmail](https://img.shields.io/badge/Gmail_SMTP-EA4335?style=for-the-badge&logo=gmail&logoColor=white)

<br/>
<br/>

# 9. Technology Selection Rationale (기술 선택 이유)

### MQTT 브로커: Mosquitto 선택 이유
| 항목 | Mosquitto | EMQX | HiveMQ |
|---|---|---|---|
| 메모리 사용량 | ~1MB (초경량) | ~200MB | ~500MB |
| ESP32 공식 지원 | ✅ | ✅ | ⚠️ |
| 오픈소스 무료 | ✅ | 일부 유료 | 일부 유료 |
| Docker 이미지 안정성 | ✅ 공식 | ✅ 공식 | ⚠️ |

→ ESP32 공식 지원, 초경량(~1MB RAM), 완전 무료 오픈소스, Docker 공식 이미지 안정성을 종합해 Mosquitto를 선택

### DB: TimescaleDB 선택 이유
| 항목 | TimescaleDB | MySQL | InfluxDB | MongoDB |
|---|---|---|---|---|
| 시계열 쿼리 속도 | ✅ 최고 | 느림 | ✅ 빠름 | 보통 |
| SQL 지원 | ✅ PostgreSQL 호환 | ✅ | ❌ 전용 언어 | ❌ |
| 자동 파티셔닝 | ✅ hypertable | ❌ | ✅ | ❌ |
| 비용 | 무료 | 무료 | 일부 유료 | 무료 |

→ 0.5초마다 쌓이는 센서 시계열 데이터 특성상 MySQL 대비 10~100배 빠른 쿼리, PostgreSQL SQL 그대로 사용 가능, 자동 파티셔닝으로 선택

### 백엔드: FastAPI 선택 이유
| 항목 | FastAPI | Django | Flask | Express |
|---|---|---|---|---|
| 요청 처리 속도 | ✅ 최고 | 보통 | 보통 | ✅ 빠름 |
| 비동기(async) 지원 | ✅ 네이티브 | 제한적 | 제한적 | ✅ |
| WebSocket 지원 | ✅ 내장 | 별도 라이브러리 | 별도 라이브러리 | 별도 라이브러리 |
| MQTT 라이브러리 호환 | ✅ paho-mqtt | ✅ | ✅ | ⚠️ |
| 자동 API 문서 | ✅ Swagger 자동생성 | ❌ | ❌ | ❌ |

→ MQTT 수신과 WebSocket 브로드캐스트를 동시에 비동기 처리해야 하는 구조에서 FastAPI가 가장 적합, 자동 Swagger 문서로 포트폴리오 설명에도 유리

### Access Token 저장: 메모리 vs localStorage
| 항목 | 메모리 (React state) | localStorage | sessionStorage |
|---|---|---|---|
| XSS 공격 노출 | ✅ 안전 | ❌ 노출 위험 | ❌ 노출 위험 |
| 페이지 새로고침 | Refresh Token으로 복구 | 유지 | 탭 닫으면 삭제 |
| 구현 복잡도 | 보통 | 단순 | 단순 |

→ XSS 공격 시 localStorage의 토큰은 즉시 탈취 가능하므로 Access Token은 메모리에만 저장, Refresh Token은 HTTP-Only Cookie로 관리

### AI 도구 활용 이유
이 프로젝트는 Claude Code를 활용해 개발 속도와 구현 품질을 높이는 데 초점을 맞췄습니다.
- 화면 구조와 컴포넌트 구성을 빠르게 반복해 UI/UX 개선 사이클을 단축하기 위해서
- React, FastAPI, Flutter 코드의 기본 구조를 빠르게 스캐폴딩하기 위해서
- 에러 원인 파악과 리팩터링을 더 빠르게 진행하기 위해서

즉, AI는 "코드를 대신 작성해주는 도구"라기보다, 구현 아이디어를 빠르게 검증하고 반복하는 협업 파트너로 활용했습니다.

<br/>
<br/>

# 10. Project Structure (프로젝트 구조)
```plaintext
smart-ashtray/
├── docker-compose.yml          # 전체 서비스 오케스트레이션
├── .env.example                # 환경 변수 템플릿
├── .gitignore
├── README.md
├── mosquitto/                  # MQTT 브로커 설정
│   ├── config/mosquitto.conf
│   ├── data/
│   └── log/
├── backend/                    # FastAPI 백엔드
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── config.py           # .env 중앙 관리
│       ├── database.py         # TimescaleDB 비동기 연결
│       ├── mqtt_client.py      # MQTT 수신 → DB 저장 → WS 브로드캐스트
│       ├── models.py
│       ├── schemas.py
│       ├── routers/
│       │   ├── auth.py         # 회원가입/로그인/인증코드
│       │   ├── booths.py       # 부스 CRUD, 텔레메트리 조회
│       │   └── commands.py     # 원격 살수 명령
│       ├── services/
│       │   ├── email_service.py
│       │   └── auth_service.py
│       └── websocket.py
├── frontend/                   # React + Vite 대시보드
│   ├── Dockerfile
│   ├── src/
│   │   ├── components/         # BoothCard, Gauge, TrendChart 등
│   │   ├── hooks/              # useWebSocket, useAuth
│   │   ├── pages/              # Dashboard, BoothDetail, Login, Register
│   │   └── lib/                # axios 인터셉터 설정
│   └── package.json
├── flutter_app/                # Flutter 모바일 앱
│   ├── lib/
│   │   ├── core/               # api_client, websocket_client, auth_interceptor
│   │   ├── models/
│   │   ├── providers/          # Riverpod providers
│   │   └── screens/
│   │       ├── auth/           # login, register (3단계 스텝)
│   │       ├── dashboard/
│   │       └── booth_detail/
│   └── pubspec.yaml
└── nginx/
    └── nginx.conf
```

<br/>
<br/>

# 11. Environment Variables (.env)
```bash
# ── 서버 ──────────────────────────────
SERVER_IP=                    # 카페24 VPS 공인 IP 또는 도메인
FRONTEND_URL=                 # http://{SERVER_IP}

# ── MQTT 브로커 ────────────────────────
MQTT_HOST=mosquitto           # Docker 서비스명 (내부 통신)
MQTT_PORT=1883
MQTT_WS_PORT=9001
MQTT_USERNAME=
MQTT_PASSWORD=

# ── 데이터베이스 ──────────────────────
POSTGRES_USER=ashtray_user
POSTGRES_PASSWORD=
POSTGRES_DB=ashtray_db
DATABASE_URL=postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@timescaledb:5432/${POSTGRES_DB}

# ── 인증 ──────────────────────────────
JWT_SECRET_KEY=               # 64자 이상 랜덤 문자열
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# ── 이메일 ────────────────────────────
GMAIL_ADDRESS=
GMAIL_APP_PASSWORD=           # Gmail 앱 비밀번호 (2단계 인증 후 발급)

# ── ESP32 MQTT 토픽 (참고) ─────────────
# ashtray/{boothId}/telemetry  ← ESP32 → 서버 센서 데이터
# ashtray/{boothId}/command    ← 서버 → ESP32 원격 명령
# ashtray/{boothId}/event      ← ESP32 → 서버 상태 변경 이벤트

# ── 추후 계획 ─────────────────────────
GEMINI_API_KEY=               # AI 챗봇 기능 추가 시 입력
```

<br/>
<br/>

# 12. Portfolio Highlights (포트폴리오에서 강조하고 싶은 포인트)
- 사용자 관점의 대시보드/관리 화면을 실제 서비스처럼 구성한 경험
- 프론트엔드, 백엔드, 모바일 클라이언트를 하나의 제품 흐름으로 연결한 경험
- IoT 환경에서 센서 데이터가 API와 UI까지 어떻게 흘러가는지 보여줄 수 있는 구조
- FreeRTOS 상태 머신 + MOSFET 제어 등 임베디드 하드웨어 설계 경험
- AI 도구(Claude Code)를 활용해 빠르게 프로토타입을 만들고 반복적으로 개선한 경험
- 기술 선택마다 대안과 수치를 비교하여 근거 있는 기술 결정을 내린 경험

# Smart Ashtray

## 프로젝트 소개
Smart Ashtray는 실내 공기질과 재떨이 상태를 실시간으로 관제하는 IoT형 관리 데모 프로젝트입니다. ESP32 기반 장치, MQTT 브로커, FastAPI 서버, React 대시보드, Flutter 모바일 화면을 연결해 “센서 데이터 수집 → 상태 해석 → 원격 제어” 흐름을 구현하는 것을 목표로 했습니다.

이 프로젝트는 단순한 UI 데모가 아니라, 다음 두 가지를 포트폴리오 관점에서 보여주기 위해 구성했습니다.
- IoT/모니터링 서비스의 사용자 흐름을 실제 서비스처럼 설계한 경험
- 프론트엔드, 백엔드, 모바일 클라이언트가 한 프로젝트 안에서 함께 동작하는 구조를 설계한 경험

## 왜 이 프로젝트를 만들었는가
이 프로젝트는 “공공장소·사무공간에서 재떨이 상태와 공기질을 자동으로 확인하고, 이상 징후가 감지되면 즉시 대응할 수 있는 시스템”을 만들고 싶다는 아이디어에서 출발했습니다.

특히 다음 문제를 해결하는 데 초점을 두었습니다.
- 재떨이 상태를 사람이 직접 확인하지 않아도 파악 가능하도록 하기
- 담배 연기·AQI 이상 징후가 발생했을 때 빠르게 인지하도록 하기
- 관리자 관점에서 상태를 한눈에 보고 원격 제어까지 수행할 수 있는 경험 제공하기

## AI를 사용한 이유
이 프로젝트는 AI 도구를 활용해 개발 속도와 구현 품질을 높이는 데 초점을 맞췄습니다.

주요 이유는 다음과 같습니다.
- 화면 구조와 컴포넌트 구성을 빠르게 반복해, UI/UX 개선 사이클을 단축하기 위해서
- React, FastAPI, Flutter 코드의 기본 구조를 빠르게 스캐폴딩하기 위해서
- 에러 원인 파악과 리팩터링을 더 빠르게 진행하기 위해서

즉, AI는 “코드를 대신 작성해주는 도구”라기보다, 구현 아이디어를 빠르게 검증하고 반복하는 협업 파트너로 활용했습니다.

## 사용한 기술 스택
### Frontend
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Recharts

이유:
- 빠르게 반응형 UI를 구성하기 좋고,
- 컴포넌트 기반 구조로 대시보드/등록/제어 화면을 분리하기 쉬웠습니다.
- Vite는 초기 실행 속도가 빨라 개발 피드백 사이클이 빠릅니다.

### Backend
- FastAPI
- Pydantic
- SQLAlchemy (비동기 기반 구조 고려)
- MQTT 연동 구조 준비
- JWT 기반 인증 구조 설계

이유:
- Python 기반으로 API 서버를 빠르게 구성하기 적합했고,
- 비동기/IoT 연동에 적합한 구조를 잡기 쉬웠습니다.
- 문서화가 잘 되어 있어 포트폴리오 프로젝트로도 설명하기 쉽습니다.

### Mobile
- Flutter
- Dart

이유:
- 모바일 UI를 빠르게 구현하고,
- 같은 상태 흐름을 손쉽게 확장해 볼 수 있었습니다.

### Infrastructure / DevOps
- Docker Compose
- Nginx
- Mosquitto MQTT Broker

이유:
- 서비스 구성 요소를 컨테이너로 분리해 배포와 실행 관점을 보여주기 좋았습니다.

## 핵심 기능
- 로그인/회원가입 진입 화면 구성
- 대시보드에서 부스 상태 요약 확인
- 부스별 상태 카드 표시
- 필터 기반 부스 목록 조회
- 수동 살수 버튼 제공
- 재떨이 적재 비율 시각화
- 모바일용 제어 화면 구성

## 프로젝트 구조
```text
backend/      FastAPI 서버 및 API 라우터
frontend/     React + TypeScript + Vite 대시보드
flutter_app/  Flutter 모바일 UI
mosquitto/    MQTT 브로커 설정
nginx/        프록시 설정
```

## 실행 방법
### 1) 환경 변수 설정
```bash
cp .env.example .env
```

### 2) 백엔드/프론트엔드 의존성 설치
```bash
cd backend
pip install -r requirements.txt

cd ../frontend
npm install
```

### 3) 실행
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

```bash
cd frontend
npm run dev
```

### 4) 브라우저 접속
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 포트폴리오에서 강조하고 싶은 포인트
- 사용자 관점의 대시보드/관리 화면을 실제 서비스처럼 구성한 경험
- 프론트엔드, 백엔드, 모바일 클라이언트를 하나의 제품 흐름으로 연결한 경험
- IoT 환경에서 API와 UI가 어떻게 연결되는지 보여줄 수 있는 구조
- AI 도구를 활용해 빠르게 프로토타입을 만들고, 반복적으로 개선한 경험

## 참고 문서
- [ACCEPTANCE_KOREAN.md](ACCEPTANCE_KOREAN.md)
- [ui-guidelines.md](ui-guidelines.md)

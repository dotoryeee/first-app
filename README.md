# 물 마신 횟수

일자별로 물 마신 횟수를 카운트하는 모바일 앱입니다. 별도 API 서버 없이 기기 내부(AsyncStorage)에서만 데이터를 저장합니다.

## 요구 사항

- Node.js 18+
- (선택) iOS 시뮬레이터: Mac + Xcode  
- (선택) 실제 폰 실행: [Expo Go](https://expo.dev/go) 앱

## 설치

```bash
git clone https://github.com/dotoryeee/first-app.git
cd first-app
npm install
```

## 사용법

### 개발 서버 실행

```bash
npm start
```

또는:

```bash
npx expo start
```

실행 후 터미널에서 다음 키를 누르면 됩니다.

| 키 | 동작 |
|----|------|
| `i` | iOS 시뮬레이터에서 실행 (Mac + Xcode 필요) |
| `a` | Android 에뮬레이터에서 실행 |
| `w` | 웹 브라우저에서 실행 |

### 실제 핸드폰에서 실행 (Expo Go)

1. [Expo Go](https://expo.dev/go)를 App Store(또는 Play 스토어)에서 설치합니다.
2. 개발 PC와 폰을 **같은 Wi‑Fi**에 연결합니다.
3. 프로젝트에서 `npm start`(또는 `npx expo start`)를 실행합니다.
4. 터미널에 나온 **QR 코드**를 Expo Go로 스캔합니다.
   - **iPhone**: 카메라 앱으로 QR 코드를 비추거나, Expo Go 앱에서 "Scan QR code" 선택
   - **Android**: Expo Go 앱에서 "Scan QR code" 선택

### 웹만 실행

```bash
npm run web
```

또는 `npx expo start --web` 후 브라우저에서 표시되는 주소(예: http://localhost:8081)로 접속합니다.

## 앱 기능

- **오늘**: 오늘 날짜, 오늘 물 마신 횟수, "물 마셨다" 버튼으로 1회 추가
- **기록**: 날짜별로 물 마신 횟수 목록 조회

데이터는 기기(또는 웹에서는 브라우저)에만 저장되며, 서버로 전송되지 않습니다.

## 프로젝트 구조

```
├── app/                 # Expo Router 화면
│   ├── _layout.tsx      # 루트 레이아웃
│   ├── index.tsx        # 메인(오늘) 화면
│   └── history.tsx       # 기록 화면
├── components/
│   ├── WaterCounter.tsx # 오늘 카운트 + 버튼
│   └── DayList.tsx      # 일자별 목록
├── lib/
│   └── storage.ts       # AsyncStorage 래퍼 (일자별 카운트)
└── package.json
```

## 라이선스

Private

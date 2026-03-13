# Farm-tner Landing Page

Farm-tner의 MVP 랜딩페이지입니다.

## Stack

- HTML
- CSS
- Vanilla JavaScript

별도 빌드 없이 `index.html`만 열어도 바로 실행됩니다.

## Local Preview

브라우저에서 `index.html`을 직접 열면 됩니다.

## GitHub 업로드

이 환경에서는 현재 `git` 명령이 설치되어 있지 않아 자동 푸시는 할 수 없습니다.
대신 아래 순서로 바로 GitHub 저장소에 업로드할 수 있게 구조와 설정은 맞춰두었습니다.

1. GitHub에서 새 저장소를 생성합니다.
2. 이 폴더 내용을 저장소 루트에 업로드합니다.
3. 또는 로컬 PC에서 Git을 설치한 뒤 아래 명령으로 푸시합니다.

```bash
git init
git add .
git commit -m "Initial Farm-tner landing page"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPOSITORY.git
git push -u origin main
```

## Vercel 연동

이 프로젝트는 정적 사이트라서 Vercel과 바로 연결할 수 있습니다.

1. Vercel에 로그인합니다.
2. `Add New Project`를 선택합니다.
3. GitHub 저장소를 Import 합니다.
4. Framework Preset은 `Other` 또는 자동 감지를 그대로 둡니다.
5. Build Command는 비워둡니다.
6. Output Directory도 비워두거나 루트 그대로 둡니다.
7. Deploy를 누릅니다.

이후 GitHub `main` 브랜치에 푸시할 때마다 Vercel이 자동 배포합니다.

## Files

- `index.html`: 랜딩페이지 마크업
- `style.css`: 전체 스타일
- `script.js`: 스티키 헤더, CTA 스크롤, 폼 검증
- `vercel.json`: 정적 배포용 헤더 및 캐시 설정

## Analytics Setup

`script.js` 상단의 아래 placeholder 값을 실제 값으로 바꾸면 됩니다.

- `ga4MeasurementId`: 예시 `G-XXXXXXXXXX`
- `hotjarSiteId`: 예시 `1234567`
- `hotjarVersion`: 기본값 `6`

현재 추적되는 이벤트:

- `cta_click`
- `signup_validation_failed`
- `signup_submit`

# 자동차 용접지그 웹사이트

자동차 용접지그 전문 제조업체의 회사 소개 웹사이트입니다.

## 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화된 화면 제공
- **회사 소개**: 회사 역사, 경력, 실적 등을 소개하는 섹션
- **제품 소개**: 다양한 용도에 맞는 용접지그 제품 카탈로그
- **서비스 안내**: 설계, 제조, 유지보수, 교육 등 제공 서비스 소개
- **문의 폼**: 견적 및 문의사항을 쉽게 제출할 수 있는 연락처 폼
- **부드러운 스크롤**: 섹션 간 이동 시 부드러운 스크롤 애니메이션
- **스크롤 애니메이션**: 요소가 화면에 나타날 때 페이드인 애니메이션

## 빠른 시작

### 로컬 실행

1. 모든 파일을 다운로드
2. `index.html` 파일을 브라우저로 열기
3. 또는 로컬 서버 실행:

```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 필요)
npx http-server

# PHP
php -S localhost:8000
```

브라우저에서 `http://localhost:8000` 접속

## 파일 구조

```
.
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트
├── app.js          # JavaScript 로직
└── README.md       # 프로젝트 설명서
```

## 커스터마이징

### 색상 변경

`style.css` 파일의 `:root` 섹션에서 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
    --primary-color: #2563eb;      /* 주요 색상 */
    --secondary-color: #64748b;    /* 보조 색상 */
    --accent-color: #f59e0b;        /* 강조 색상 */
    /* ... */
}
```

### 연락처 정보 변경

`index.html` 파일에서 다음 섹션을 찾아 정보를 수정하세요:

- 문의하기 섹션의 연락처 정보
- 푸터의 연락처 정보

### 문의 폼 백엔드 연결

`app.js` 파일의 `handleFormSubmission` 함수에서 실제 서버 API 엔드포인트로 연결하세요:

```javascript
fetch('/api/contact', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject)
})
.then(response => response.json())
.then(data => {
    // 성공 처리
})
.catch(error => {
    // 에러 처리
});
```

## 배포하기

### GitHub Pages

1. GitHub에 저장소 생성
2. 파일 업로드
3. Settings > Pages에서 main 브랜치 선택
4. 자동으로 배포됨

### Netlify

1. https://www.netlify.com 접속
2. "Add new site" > "Deploy manually"
3. 프로젝트 폴더 드래그 앤 드롭
4. 자동 배포 완료

### Vercel

1. https://vercel.com 접속
2. GitHub 저장소 연결
3. 자동 배포

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 기술 스택

- HTML5
- CSS3 (CSS Grid, Flexbox, CSS Variables)
- Vanilla JavaScript (ES6+)
- Font Awesome 아이콘
- Google Fonts (Noto Sans KR)

## 라이선스

이 프로젝트는 자유롭게 사용 가능합니다.

## 문의

웹사이트 관련 문의사항이 있으시면 이슈를 등록해주세요.

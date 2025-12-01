# 도메인 등록 및 배포 가이드

## 1. 도메인 구매

### 국내 도메인 등록 대행사
- **가비아** (https://www.gabia.com)
- **후이즈** (https://whois.co.kr)
- **카페24** (https://www.cafe24.com)
- **네임서치** (https://www.namesearch.co.kr)

### 해외 도메인 등록 대행사
- **Namecheap** (https://www.namecheap.com)
- **GoDaddy** (https://www.godaddy.com)
- **Google Domains** (https://domains.google)

### 도메인 선택 팁
- `.com`, `.net`, `.org` - 일반적인 도메인
- `.co.kr`, `.kr` - 한국 도메인
- `.dev`, `.app` - 개발자용 도메인

## 2. 웹 호스팅 선택

### 무료 호스팅 옵션 (추천)

#### GitHub Pages (가장 추천)
1. GitHub 계정 생성 (https://github.com)
2. 새 저장소 생성
3. 프로젝트 파일 업로드
4. Settings > Pages에서 브랜치 선택
5. 자동으로 `https://username.github.io/repository-name` 주소 생성
6. 커스텀 도메인 연결 가능

**장점:**
- 완전 무료
- 자동 HTTPS
- Git으로 버전 관리
- 간단한 설정

#### Netlify
1. Netlify 계정 생성 (https://www.netlify.com)
2. GitHub 저장소 연결 또는 드래그 앤 드롭으로 배포
3. 자동으로 `https://random-name.netlify.app` 주소 생성
4. 커스텀 도메인 연결 가능

**장점:**
- 무료 플랜 제공
- 자동 배포
- CDN 포함
- SSL 인증서 자동 발급

#### Vercel
1. Vercel 계정 생성 (https://vercel.com)
2. GitHub 저장소 연결
3. 자동 배포 및 도메인 제공

**장점:**
- 빠른 배포 속도
- 무료 플랜
- 자동 HTTPS

### 유료 호스팅 옵션

#### 카페24
- 한국 서버
- 한국어 지원
- 월 5,000원~ 시작

#### AWS (Amazon Web Services)
- S3 + CloudFront
- 확장성 좋음
- 사용량 기반 과금

#### Google Cloud Platform
- Cloud Storage
- Firebase Hosting
- 무료 티어 제공

## 3. 배포 방법 (GitHub Pages 예시)

### Step 1: GitHub 저장소 생성
```bash
# 로컬에서 Git 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub에 저장소 생성 후
git remote add origin https://github.com/username/repository-name.git
git branch -M main
git push -u origin main
```

### Step 2: GitHub Pages 활성화
1. GitHub 저장소로 이동
2. Settings 클릭
3. 왼쪽 메뉴에서 "Pages" 선택
4. Source에서 "main" 브랜치 선택
5. Save 클릭
6. 몇 분 후 `https://username.github.io/repository-name` 접속 가능

### Step 3: 커스텀 도메인 연결
1. GitHub 저장소 Settings > Pages
2. Custom domain에 도메인 입력 (예: `yourdomain.com`)
3. 도메인 등록 대행사에서 DNS 설정:
   - Type: A
   - Host: @
   - Value: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 또는 Type: CNAME, Host: www, Value: `username.github.io`

## 4. Netlify 배포 방법

### 드래그 앤 드롭 방식
1. Netlify 사이트 접속
2. "Add new site" > "Deploy manually"
3. 프로젝트 폴더를 드래그 앤 드롭
4. 자동으로 배포 완료

### GitHub 연동 방식
1. "Add new site" > "Import an existing project"
2. GitHub 계정 연결
3. 저장소 선택
4. Build settings:
   - Build command: (비워둠)
   - Publish directory: `/` 또는 `.`
5. Deploy 클릭

### 커스텀 도메인 연결
1. Site settings > Domain management
2. "Add custom domain" 클릭
3. 도메인 입력
4. DNS 설정 안내 따르기

## 5. DNS 설정 가이드

### A 레코드 설정
```
Type: A
Host: @ (또는 비워둠)
Value: 호스팅 제공자의 IP 주소
TTL: 3600 (또는 기본값)
```

### CNAME 레코드 설정
```
Type: CNAME
Host: www
Value: 호스팅 제공자의 도메인 (예: username.github.io)
TTL: 3600
```

### DNS 전파 시간
- 보통 24-48시간 소요
- 최대 72시간까지 걸릴 수 있음

## 6. HTTPS 설정

### 자동 HTTPS (대부분의 호스팅 제공자)
- GitHub Pages: 자동
- Netlify: 자동
- Vercel: 자동

### 수동 설정 (필요한 경우)
- Let's Encrypt 인증서 사용
- 호스팅 제공자의 SSL 설정 메뉴 활용

## 7. 빠른 배포 체크리스트

- [ ] 도메인 구매 완료
- [ ] 호스팅 서비스 선택
- [ ] 프로젝트 파일 준비
- [ ] GitHub 저장소 생성 (또는 호스팅 업로드)
- [ ] DNS 설정 완료
- [ ] SSL 인증서 활성화 확인
- [ ] 도메인 연결 확인
- [ ] 웹사이트 접속 테스트

## 8. 추천 배포 순서 (초보자용)

1. **GitHub Pages 사용** (가장 간단)
   - GitHub 계정 생성
   - 저장소 생성 및 파일 업로드
   - Pages 활성화
   - 무료 도메인으로 시작: `username.github.io`

2. **도메인 구매 후 연결**
   - 원하는 도메인 구매
   - GitHub Pages에 커스텀 도메인 추가
   - DNS 설정

3. **고급 기능 필요 시**
   - Netlify 또는 Vercel로 마이그레이션
   - 더 많은 기능 활용

## 9. 문제 해결

### 도메인이 연결되지 않을 때
- DNS 전파 시간 확인 (최대 72시간)
- DNS 설정이 올바른지 확인
- 호스팅 제공자의 가이드 확인

### HTTPS 오류
- SSL 인증서 발급 대기 (보통 자동)
- DNS 설정 확인
- 호스팅 제공자 지원팀 문의

### 파일이 업데이트되지 않을 때
- 브라우저 캐시 삭제 (Ctrl+F5)
- 배포 상태 확인
- Git push 확인

## 10. 추가 리소스

- GitHub Pages 문서: https://docs.github.com/en/pages
- Netlify 문서: https://docs.netlify.com
- DNS 설정 가이드: https://www.cloudflare.com/learning/dns/



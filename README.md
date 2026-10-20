# Movie Next

영화 정보를 보고 리뷰와 평점을 남기는 웹 서비스입니다.

## 기능

- 회원가입, 로그인, 로그아웃
- 영화 목록·검색·상세 조회
- 관리자 영화 등록·수정·삭제
- 리뷰 등록·삭제, 평균 평점, 좋아요
- 프로필 이미지 변경

## 기술

Next.js 15 · React 19 · Prisma · MySQL · bcryptjs

## 실행

Node.js 20 이상과 MySQL이 필요합니다. 새 로컬 DB를 만들고 `.env.example`을 `.env`로 복사한 뒤 접속 정보를 입력합니다.

```bash
npm ci
npx prisma generate
npx prisma db push
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속합니다. `prisma db push`는 연결된 DB의 구조를 변경하므로 새 개발용 DB를 사용합니다.

처음에는 영화 데이터가 없습니다. 회원가입 후 개발 DB에서 해당 계정의 `role`을 `ADMIN`으로 설정하면 영화를 등록할 수 있습니다. 기존 DB와 업로드 이미지는 저장소에 포함하지 않았습니다.

현재 세션은 테스트용으로 1분 동안 활동이 없으면 만료됩니다.

## 테스트

[QA 기록](docs/qa/README.md)에 회원가입·리뷰 테스트와 화면·SQL 확인 결과를 정리했습니다.

## django
### 목차
- django란?
- 환경 설정
- 사용 패키지
- 주로 나오는 객체
- config
- users
- pongGame
#### django란?
- django는 파이썬 언어를 기반으로 한 풀스택 웹서버 프레임워크. 여기서는 백엔드 전용으로 사용한다. 프론트 쪽은 nginx가 전담한다.
#### 환경 설정
- BASE_DIR : django 프로젝트가 적용될 기본 경로
- WSGI : WSGI 서버를 설정할 지 ASGI 서버를 설정할 지 정하는 플래그
- SECRET_KEY : 인증용 해시, 백엔드 세션, 암호 변경 화면 등에 사용. 보안에 심각한 위험이 있으므로 별도 .env를 통해 가져온다
- DEBUG : 서버 내 문제가 발생하면 세부 사항을 출력한다. 실제로 평가 시에는 False로 적용
- ALLOWED_HOSTS : 서버에 접근이 가능한 호스트
- INSTALLED_APPS : 백엔드에서 사용할 애플리케이션을 적용한다. 각 app으로 구성된 패키지들도 이를 통해 적용
- MIDDLEWARE : 프론트 - django 서버 사이에서 요청 처리할 때 필요한 기능을 제공한다. cors, csrf 공격을 막기 위한 방어 기능이 제공되는 등.
- ROOT_URLCONF : 가장 먼저 url 경로 분석을 할 파일을 어디로 할 것인지
- TEMPLATES : django 내부에서 사용할 html 파일이나 js 파일 적용. 현 서버는 백엔드 전용 서버이므로 프론트를 nginx로 분화했기에 적용하지 않는다.
- WSGI_APPLICATION : wsgi 서버 설정 시에 적용할 파일
- ASGI_APPLICATION : asgi 서버 설정 시에 적용할 파일
- CORS_ORIGIN_ALLOW_ALL : 최초 자원이 서비스 된 도메인 외에 다른 도메인 접속을 모두 허용하는가 여부
- CORS_ALLOW_CREDENTIALS : 쿠키가 cross-site http 요청에 포함될 수 있음
- CORS_WHITELIST : 안에 기록된 도메인으로 접속 시에 cors 면제해 줌
- CORS_ALLOW_HEADERS : cors 요청 시에 적어도 되는 헤더
- DATABASES : db 연결 설정. default는 별도 요구사항 없으면 바로 연결하는 db이며 postgres로 설정함
- AUTH_USER_MODEL : django에서 user 인증 시에 사용할 모델 설정. 사실 어차피 custom해서 쓰고 있기에 별도 설정할 필요는 없다
- AUTH_PASSWORD_VALIDATORS : password 유효성 검증을 위해 사용할 미들웨어. 어차피 password로 별도 로그인 과정이 없기에 필요 없음
- LANGUAGE_CODE : django에 기본으로 적용할 언어 코드
- TIME_ZONE : 서버가 인식할 시간대
- USE_I18N : django에서 번역 체계를 사용할 지 여부. i18n은 국제화 약자
- USE_TZ : 모든 곳에 TIMEZONE을 적용할 지 말 지 여부. false면 모든 곳에 datetime을 적용하고 true면 템플릿과 폼에만 적용
- EMAIL... : SMTP 서비스를 이용하여 EMAIL을 보내기 위해 적용하는 설정
- STATIC_URL : 정적 파일들이 보관된 장소로 이동하기 위한 url 경로
- STATIC_FIELS_DIRS : 정적 파일 보관할 경로
- MEDIA_URL : 미디어 파일이 보관된 장소로 이동하기 위한 url 경로
- MEDIA_ROOT : 미디어 파일을 보관할 경로
- DEFAULT_AUTO_FIELD : db 모델을 자동으로 설정할 때 어떤 방법으로 할 지
#### 사용 패키지
- os : 운영체제에서 설정한 각종 내용물을 받기 위해 사용
- json : json 파일을 읽기 위해 사용
- datetime : 시간대를 확인하고 각 토큰의 사용기한을 정하기 위해 사용
- hashlib : 해싱 암호화 방식을 지정하기 위해 사용
- hmac : 메시지 인증을 위해 사용하는 해싱 패키지. 보통 key + message 형태로 들어가서 해싱을 하며 여기서는 jwt 토큰 서명 부분을 암호화하기 위해 사용
- base64 : 공통 ascii 영역으로 이루어진 6비트 이진 데이터로 인코딩. jwt 토큰 내용들을 최종적으로 인코딩할 때 사용. 디코딩할 때도 마찬가지
#### 주로 나오는 객체
- request : 프론트에서 받아오는 request를 매개변수로 설정할 때 쓰는 변수명. 즉, request 객체를 받을 때 쓴다.
	- request.GET.get : request 메서드가 GET인 경우에 url에 있는 쿼리를 받아올 떄 사용한다. 쿼리를 파이썬 사전 형태로 저장해서 사용하기에 쿼리에서 적절한 키를 넣어서 검색하면 값을 얻을 수 있다.
		- 반환형 : key에 맞는 value가 있으면 value, 없으면 None
	- request.body : request 메서드가 POST인 경우에 request.body에 내용물을 담을 수 있다. 이 때 프론트가 담아서 보내준 body 내용을 받아온다. header에 있는 content-type에 지정된 양식으로 보내며 여기서는 json 파일로 오는 걸로 역속했기에 json.loads(request.body)를 통해 적절히 파이썬 사전 형태로 번역한다.
	- dictionary.get('key', None) : 사전 형태에서 key 값에 해당하는 value가 있는 지 찾는다. 없으면 None 반환
	- model_name.objects.get : 해당 모델 객체가 존재하는 지 확인한다. 매개변수로 테이블 내에 있는 원소 중 하나의 key 값이 들어가며 만약 없으면 DoseNotExist 에러를 도출한다.
	- JsonResponse : 프론트에 전할 응답을 json 형식으로 반환한다.
#### config
#### user
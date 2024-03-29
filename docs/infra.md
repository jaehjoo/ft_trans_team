## INFRA
### 목차
- 전체 틀
- nginx
- django-wsgi
- django-asgi
- front
- db
#### 전체 틀
- 구조
	- 브라우저 <-> 프론트 + nginx <-> (wsgi or asgi) <-> db
- 구분
	- 프론트 : front + nginx
	- 백엔드 : django-wsgi + django-asgi
	- 데이터 베이스 : db
- 프론트
	- 장고에서 기본적으로 내장한 파일을 제외한 media 및 static 파일은 전부 프론트에서 보유
	- nginx는 프론트에서 발생하는 요청을 백엔드 서버에 연결해주는 역할
- 백엔드
	- wsgi : 주로 정적인 요청을 처리. 웹소켓을 제외한 대부분의 영역을 wsgi가 관리한다.
	- asgi : 웹소켓을 이용한 통신 시 요청을 처리.
- 데이터베이스
	- db는 백엔드 서버와 연결되어 있음
	- 전부 django의 모델을 이용해서 간접 통신을 하며 직접 명령어로 기입해서 처리하는 부분은 X
#### nginx
- 1차 서버로 포트 포워딩을 통해 클라이언트와 가장 근접한 서버
- 프론트가 요청을 주면 nginx에서 각 url 블록에 따라 요청을 옮겨준다
#### django-wsgi
- 2차 서버로 nginx에서 /api, /admin 요청을 받으면 처리를 해준다
#### django-asgi
- 2차 서버로 nginx에서 /ws 요청을 받으면 처리를 해준다
#### front
- 파일은 전부 nginx에 귀속
#### db
- postgres를 사용
- django model을 이용해서 테이블 생성 삭제를 전부 수행하기 때문에 별도 설정은 하지 않는다
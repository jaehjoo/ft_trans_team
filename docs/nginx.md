## nginx
### 목차
- nginx란?
- 환경 설정
#### nginx란?
- 하나의 마스터 프로세스를 이용하여 한정된 워커 프로세스에 효율적으로 일을 배당하는 웹서버
- 동적 요청의 처리는 불가하기에 별도로 WAS 서버가 필요함
#### 환경 설정
- nginx.conf
	- user : nginx를 사용하는 대상. root로 설정하면 관리자 권한이 생기므로 보안적으로 문제가 생긴다
	- worker_process : 마스터 프로세스 밑에서 각 요청을 처리할 프로세스. auto로 설정하면 사용할 수 있는 cpu core 수 만큼 배정한다.
	- pid : nginx process id를 보관하는 곳
	- sendfile : 파일 전송이 가능한 지 여부
	- keepalive_timeout : 아무런 입력이 없을 때 언제까지 서버를 유지시킬 지
	- include /etc/nginx/mime.types 각 바이너리 파일로 전송되는 파일이 어떠한 형식으로 인코딩 해야 되는 지 알려주는 파일
	- access_log : nginx에 접속하는 대상에 대한 기록을 남기는 곳
	- error.log : nginx에서 발생한 에러를 기록할 곳
	- include sites-enabled : 개인적으로 만든 서버 설정을 적용한다
- nginx-app.conf
	- listen : 어느 포트로 들어오는 내용을 들을 지 정한다. ssl을 적용할 거면 ssl도 적을 것. 대괄호(\[\])가 들어간 부분은 ipv6, 안 들어간 부분은 ipv4다
	- server_name : 서버명
	- ssl_certificate : ssl 인증서가 보관된 장소
	- ssl_protocols : ssl 프로토콜을 몇 버전으로 적용할 지
	- location : url이 들어올 때, url 경로에 따른 설정을 하는 용도
		- / : server_name만 들어온 경우에 해당 설정 적용
		- root : server_name이 들어가는 url이 안내할 경로
		- index : root 경로로 진입했을 때 띄워주는 페이지
		- try_files : 해당 경로를 적용하며 파일 찾기를 시도하고 없으면 index.html로 안내한다
	- location /api : root 경로에 추가로 api가 들어왔을 때 설정
		- proxy_pass : proxy를 적용하여 해당 경로를 pass 경로로 안내한다
		- proxy_set_header Host : header에 넣을 Host를 강제로 적용한다
	- location /ws : websocket을 위한 설정
		- proxy_http_version : proxy 접속 시에 적용할 http 프로토콜 선택
		- proxy_set_header Upgrade : HTTP에 연결되는 서버를 웹소켓 연결로 변환
		- proxy_set_header Connection : 커넥션을 Upgrade로 이어준다
	- location /media/ : 각종 이미지, 영상 등을 저장한 경로로 안내
		- alias : 후술할 경로로 적힌 곳으로 안내한다
	- location /static/ : html, css 등 static 내용물이 보관된 곳으로 안내한다
		- alias : 후술할 경로로 적힌 곳으로 안내한다
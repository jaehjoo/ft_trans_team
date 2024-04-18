## API
### 목차
- API 공통 사항
- main
- login
- auth2fa
- input2fa
#### API 공통 사항
- 전제 조건
	- 로그인 전에 POST 불가 : POST는 csrftoken이 발급되어야 가능하며 csrftoken은 42 로그인 또는 jwt로 로그인이 성공하면 제공
	- 요청/응답 시에 json 파일로 전달
	- GET일 때 요구하는 내용은 쿼리로 전달
	- 필수 헤더
		- method : GET or POST
		- mode : "cors"
		- Content-Type : "application/json"
		- (POST 요청 시) X-CSRFToken : 토큰값
- response 메세지 형식
	- success : "Y" or "N"
	- message : "{fail or success}.{무엇을 성공했는 지}.{추가 내용}"
	- redirect_uri : {해당 응답 후에 이동할 곳으로 기대하는 경로}
	- content : 각종 첨부할 내용물을 담아두는 곳
#### main
- GET : jwt 토큰을 통해 main 화면 이동이 가능한 지 검증하고 결과 전달
	- request
		- 내용 : url 쿼리로 각각 'access'를 'refresh' 전달
		- 형식 : $uri?access={access_value}&refresh={refresh_value}
		- 만약 토큰이 없으면 "null" 문자열로 보낼 것
	- response
		- access 또는 refresh 실패 시
			- success : N
		- access 성공 시
			- success : Y
		- refresh 성공 시
			- success : Y
			- content : { access : 토큰값 }
#### login
- GET : 42 인증을 시도한다
	- request : 쿼리로 access 토큰값과 42로그인 버튼을 눌러 얻은 code값을 같이 보낸다. code 값은 api에 기록된 redirect_uri(/shallwe)로 전송되며 이를 프론트엔드에서 백엔드로 보내줘야 한다.
	- response
		- access 성공 시
			- success : Y
			- content : { csrftoken : 토큰값 }
		- access 실패, 42 인증 성공
			- success : Y
			- content : { access : 토큰값, refresh : 토큰값, csrftoken : 토큰값 }
		- 둘 다 실패
			- success : N
#### auth2fa
- POST : 2fa 적용 및 코드 발급 시도
	- request : header에 X-CSRFToken 명으로 csrftoken을 삽입하고 body에 access, 2fa 중 어느 것을 사용하는 지 여부를 보내준다(ex. email : Y)
	- response
		- 성공
			- success : Y
		- 실패
			- success : N
#### input2fa
- POST : 2fa 코드 적합 여부
	- request
		- header : { X-CSRFToken : 토큰값 }
		- body : { access : access_token, code : 사용자입력_코드값 }
	- response
		- 성공
			- success : Y
		- 실패
			- success : N
#### info
- GET : 사용자 정보를 클라이언트에게 전달
	- request
		- body : { access : access_token }
	- response
		- 성공
			- success : Y
			- user : { displayname : 사용자명, email : 사용자 이메일}
			- avatar : { hair : 지정한 머리, eye : 지정한 눈, lip : 지정한 입, face : 지정한 피부색, body : 지정한 몸통 }
			- ponggame_record : { win : 승리 횟수, lose : 패배 횟수, rating : 레이팅 }
			- fightinggame_record : { win : 승리 횟수, lose : 패배 횟수, rating : 레이팅 }
- POST : 사용자 정보를 변경한다
	- request
		- head : { X-CSRFToken : 토큰값 }
		- body : {
			access : access_token,
			user : { 변경하고 싶은 값을 GET과 동일한 key값으로 value만 변경해서 넣어주세요 },
			avatar : { 변경하고 싶은 값을 GET과 동일한 key값으로 value만 변경해서 넣어주세요 }
		}
	- response
		- 성공
			- success : Y
			- user : 변경된 사용자값
			- avatar : 변경된 아바타값
		- 실패
			- success : N
#### friends
- GET : 현재 클라이언트가 등록한 친구 정보를 전송한다
	- request
		- body : { access : access_token },
	- response
		- 성공
			- friendsList : {
				{ name : 친구이름, connect : 로그인 여부, pongWin : 탁구 승리 횟수, pongLose : 탁구 패배 횟수, fightingWin : 격투 승리 횟수, fightingLose : 격투 패배 횟수
				},
				이하 친구 수 만큼 반복 
			}
		- 실패
			- success : N
- POST : 친구를 신규 등록 또는 제거
	- request
		- header : { X-CSRFToken : 토큰값 }
		- body : {
			access : access_token,
			mode : (추가 시) add, (삭제 시) del,
			friend_name : 명령 대상 친구 이름
		}
	- response
		- 성공
			- success : Y
		- 실패
			- success : N
#### list
- GET : 사용자 명단을 알려준다
	- request
		- header : { X-CSRFToken : 토큰값 }
		- body : { access : access_token }
	- response
		- 성공
			- userList : {
				{
					name : 사용자 명
				},
				이하 사용자 수 만큼 반복
			}
#### logout
- POST : 사용자 접속 종료
	- request
		- header : { X-CSRFToken : 토큰값 }
		- body : { access : access_token }
	- response
		- 성공
			- success : Y
		- 실패
			- success : N
#### delete
- POST : 사용자 정보 제거
	- request
		- header : { X-CSRFToken : 토큰값 }
		- body : { access : access_token }
	- response
		- 성공
			- success : Y
		- 실패
			- success : N
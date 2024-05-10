## pong 토너먼트 경기 구현 및 수정사항

### Room 클래스
- checkScore 메서드의 status 값을 기준으로 한 조건문 분기로 self.player0과 self.player1에 매치에 맞는 플레이어를 대입한 후 match1은 winner를, match2는 winner2로 승리한 플레이어를 임시로 저장함.

### pongTournamentConsumers.py/"PongTournamentConsumer"
- receive 메서드에 winner, winner2의 값 할당 여부를 기준으로 매치를 나타내는 room.status 값을 변경 했습니다.
동시에 tournament.js의 1004번 째 라인의 코드
< 변경 전 >
scene[1].match2Winner = textData.data['winner'];
< 변경 후 >
scene[1].match2Winner = textData.data['winner2'];
로 변경 했습니다.

## pongTournamentConsumers.py/"enter_room 함수"
- 토너먼트 게임 방에 플레이어 4명이 다 차게되면 RoomList에 해당 Room 객체를 넣고 Room 객체 메서드의 setPlayer를 호출해 각 유저의 레이팅을 오름차순으로 정렬해 player0과 player1은 "match1", player2와 player3은 "match2"로 경기가 구성되도록 유도했습니다.

## 막힌 부분/"receive"
- 1. msg_type == "set_game"이면 모든 플레이어가 준비가 됐다는 뜻이므로 while loop를 통해 match3까지 세 번 반복하며, 게임이 끝나면 room.status (예시 "match1", "match2", "match3")를 다음 경기로 바꿔주어야 하는지

- 2. 게임 자체는 room.player0Bar와 room.player1Bar만 사용하므로 매치가 변경되면 player0과 player1에 알맞은 player들 (예시 "player2", "player3", "winner", "winner2")로만 변경해주면 되는지 아니면 Bar 관련 데이터 값도 모두 초기화를 해주어야 하는지 ?
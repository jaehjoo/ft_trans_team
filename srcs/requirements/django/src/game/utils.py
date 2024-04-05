# 대결 후에 rating 변동 계산
# state는 player가 이겼는 지 졌는 지를 나타낸다. win = 0, lose = 1
def rating_calculator(player_rating, enemy_rating, state):
	extra_rating = 0
	if state == 0:
		factor = enemy_rating - player_rating
	else:
		factor = player_rating - enemy_rating
	if factor > 500:
		extra_rating = 100
	elif factor > 300:
		extra_rating = 50
	elif factor >= 0:
		extra_rating = 25
	elif factor > -300:
		extra_rating = 10
	else:
		extra_rating = 1
	if state == 1:
		extra_rating *= -1
	total_rating = player_rating + extra_rating
	if total_rating > 1800:
		total_rating = 1800
	if total_rating < 0:
		total_rating = 0
	return total_rating

class Window {
    constructor(width, height, border, middleX, middleY) {
        this.width = width;
        this.height = height;
        this.border = border;
        this.middle = {middleX, middleY}
    }
}

class Player {
    constructor(name, rating) {
        this.name = name;
        this.rating = rating;
    }
}

class Bar {
    constructor(x, y, width, height, up, down) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.up = up;
        this.down = down;
    }

    set_bar(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        if (this.up == true) {
            this.y -= 7;
        }
        else if (this.down == false) {
            this.y += 7;
        }
    }
}

class Score {
    constructor() {
        this.ONE = 0;
        this.TWO = 0;
        this.WIN = 11;
    }

    set_score(one, two) {
        this.ONE = one;
        this.TWO = two;
    }
}

class Ball {
    constructor(x1, y1, x2, y2, radius) {
        this.ballX = x1;
        this.ballY = y1;
        this.velocityX = x2;
        this.velocityY = y2;
        this.radius = radius;
        this.serve = 0;
        this.initLoca = {x1, y1};
    }

    set_ball(x, y) {
        this.ballX = x;
        this.ballY = y;
    }

	set_velocity(x, y) {
		this.velocityX = x
		this.velocityY = y
    }

	update() {
		this.ballX += this.velocityX
		this.ballY += this.velocityY
    }

    init() {
        this.initLoca[0] = this.ballX; this.initLoca[1] = this.ballY;
		if (this.velocityX < 0 && this.velocityX != -3)
			this.velocityX = -3
		else if (this.velocityX > 0 && this.velocityX != 3)
			this.velocityX = 3
		if (this.velocityY < 0 && this.velocityY != -3)
			this.velocityY = -3
		else if (this.velocityY > 0 && this.velocityY != 3)
			this.velocityY = 3
		if (this.serve == 2) {
			this.velocityX *= -1;
			this.velocityY *= -1;
			this.serve = 0
        }
    }
}

export class Room {
    constructor(mode) {
		this.winner = "";
		this.winner2 = "";
		this.winner3 = "";
		this.window = Window(1024, 768, 1024 / 50, 1024 / 80, 768);
		this.ball = Ball(1024 / 2, 768 / 2, 3, 3, 1024 / 100);
		this.score = Score();
		this.mode = mode;
		this.status = "match1";
		if (this.mode == "two") {
			this.player0bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50, this.window.height / 4 - this.window.height / 14)
			this.player1bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50, this.window.height / 4 * 3 - this.window.height / 14)
			this.player2bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50 * 48 + 3, this.window.height / 4 - this.window.height / 14)
			this.player3bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50 * 48 + 3, this.window.height / 4 * 3 - this.window.height / 14)
        }
		else if (this.mode == "one") {
			this.player0bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50, this.window.height / 2 - this.window.height / 14)
			this.player1bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50 * 48 + 3, this.window.height / 2 - this.window.height / 14)
        }
    }
	
	setForNextMatch() {
		this.score = Score()
		this.window = Window(1024, 768, 1024 / 50, 1024 / 80, 768)
		this.ball = Ball(1024 / 2, 768 / 2, 3, 3, 1024 / 100)
		this.player0bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50, this.window.height / 2 - this.window.height / 14)
		this.player1bar = Bar(this.window.width / 60, this.window.height / 7, this.window.width / 50 * 48 + 3, this.window.height / 2 - this.window.height / 14)
    }

	setBarLocation(x1, y1, x2, y2) {
		this.player0bar.set_bar(x1, y1)
		this.player1bar.set_bar(x2, y2)
    }

	setBallLocation(x, y) {
		this.ball.set_ball(x, y)
    }
	
	setBallVelocity(x, y) {
		this.ball.set_velocity(x, y)
    }
	
	setScore(this, ONE, TWO) {
		this.score.setScore(ONE, TWO)
    }
	
	setplayer0barState(state, value) {
		if (state == "up") {
			this.player0bar.up = value
        }
		if (state == "down") {
			this.player0bar.down = value
        }
    }
	
	setplayer1barState(state, value) {
		if (state == "up") {
			this.player1bar.up = value
        }
		if (state == "down") {
			this.player1bar.down = value
        }
    }

	setplayer2barState(state, value) {
		if (state == "up") {
			this.player2bar.up = value
        }
		if (state == "down") {
			this.player2bar.down = value
        }
    }

	setplayer3barState(state, value) {
		if (state == "up") {
			this.player3bar.up = value
        }
		if (state == "down") {
			this.player3bar.down = value
        }
    }

    getHitFactor(barMiddlePoint, barHarfHeight) {
		return ((barMiddlePoint - this.ball.ballY) / barHarfHeight) * 1.2
    }
	
	update() {
		this.player0bar.update()
		this.player1bar.update()
		if (this.mode == "two") {
			this.player2bar.update()
			this.player3bar.update()
        }
		this.ball.update()
		this.checkWallCollision()
		this.checkBarCollision()
		this.checkBoundary()
		this.checkScore()
    }

	checkWallCollision(this) {
		if ((this.ball.ballY + this.ball.velocityY > this.window.height - this.window.border - this.ball.radius) || (this.ball.ballY + this.ball.velocityY < this.window.border + this.ball.radius))
			this.ball.velocityY *= -1.2
		if (this.mode == "one") {
			if (this.player0bar.y < this.window.border)
				this.player0bar.y = this.window.border
			if (this.player0bar.y > this.window.height - this.window.border - this.player0bar.height)
				this.player0bar.y = this.window.height - this.window.border - this.player0bar.height
			if (this.player1bar.y < this.window.border)
				this.player1bar.y = this.window.border
			if (this.player1bar.y > this.window.height - this.window.border - this.player1bar.height)
				this.player1bar.y = this.window.height - this.window.border - this.player1bar.height	
        }
	
		else {
			if (this.player0bar.y < this.window.border)
				this.player0bar.y = this.window.border
			if (this.player0bar.y > this.window.height / 2 - this.player0bar.height)
				this.player0bar.y = this.window.height / 2 - this.player0bar.height
			if (this.player1bar.y < this.window.height / 2)
				this.player1bar.y = this.window.height / 2
			if (this.player1bar.y > this.window.height - this.window.border - this.player1bar.height)
				this.player1bar.y = this.window.height - this.window.border - this.player1bar.height
			if (this.player2bar.y < this.window.border)
				this.player2bar.y = this.window.border
			if (this.player2bar.y > this.window.height / 2 - this.player2bar.height)
				this.player2bar.y = this.window.height / 2 - this.player2bar.height
			if (this.player3bar.y < this.window.height / 2)
				this.player3bar.y = this.window.height / 2
			if (this.player3bar.y > this.window.height - this.window.border - this.player3bar.height)
				this.player3bar.y = this.window.height - this.window.border - this.player3bar.height
        }
    }


    checkBarCollision(this) {
		if (this.mode == "one") {
			if (this.ball.ballX - this.ball.radius < this.player0bar.x + 10 && this.ball.ballY + this.ball.velocityY >= this.player0bar.y && this.ball.ballY + this.ball.velocityY <= this.player0bar.y + this.player0bar.height) {
				dir = this.getHitFactor(this.player0bar.y + this.player0bar.height / 2, this.player0bar.height / 2)
				this.ball.velocityX *= -1.2
				this.ball.velocityY *= dir
            }
			if (this.ball.ballX + this.ball.radius > this.player1bar.x + this.player1bar.width - 10 && this.ball.ballY + this.ball.velocityY >= this.player1bar.y && this.ball.ballY + this.ball.velocityY <= this.player1bar.y + this.player1bar.height) {
				dir = this.getHitFactor(this.player1bar.y + this.player1bar.height / 2, this.player1bar.height / 2)
				this.ball.velocityX *= -1.2
				this.ball.velocityY *= dir
            }
        }

		if (this.mode == "two") {
			if (this.ball.ballX - this.ball.radius < this.player0bar.x + 10 && this.ball.ballY + this.ball.velocityY >= this.player0bar.y && this.ball.ballY + this.ball.velocityY <= this.player0bar.y + this.player0bar.height)
				dir = this.getHitFactor(this.player0bar.y + this.player0bar.height / 2, this.player0bar.height / 2)
				this.ball.velocityX *= -1.2
				this.ball.velocityY *= dir
			if (this.ball.ballX - this.ball.radius < this.player1bar.x + 10 && this.ball.ballY + this.ball.velocityY >= this.player1bar.y && this.ball.ballY + this.ball.velocityY <= this.player1bar.y + this.player1bar.height) {
				dir = this.getHitFactor(this.player1bar.y + this.player1bar.height / 2, this.player1bar.height / 2)
				this.ball.velocityX *= -1.2
				this.ball.velocityY *= dir
            }
			if (this.ball.ballX + this.ball.radius > this.player2bar.x + this.player2bar.width - 10 && this.ball.ballY + this.ball.velocityY >= this.player2bar.y && this.ball.ballY + this.ball.velocityY <= this.player2bar.y + this.player2bar.height) {
				dir = this.getHitFactor(this.player2bar.y + this.player2bar.height / 2, this.player2bar.height / 2)
				this.ball.velocityX *= -1.2
				this.ball.velocityY *= dir
            }
			if (this.ball.ballX + this.ball.radius > this.player3bar.x + this.player3bar.width - 10 && this.ball.ballY + this.ball.velocityY >= this.player3bar.y && this.ball.ballY + this.ball.velocityY <= this.player3bar.y + this.player3bar.height) {
				dir = this.getHitFactor(this.player3bar.y + this.player3bar.height / 2, this.player3bar.height / 2)
				this.ball.velocityX *= -1.2
				this.ball.velocityY *= dir
            }
        }
    }

	checkBoundary(this) {
		if (this.mode == "two") {
			if (this.ball.ballX < this.player0bar.x) {
				this.ball.serve += 1
				this.ball.init()
				this.score.TWO += 1
            }
			else if (this.ball.ballX > this.player2bar.x + this.player2bar.width) {
				this.ball.serve += 1
				this.ball.init()
				this.score.ONE += 1
            }
        }
		else {
			if (this.ball.ballX < this.player0bar.x) {
				this.ball.serve += 1
				this.ball.init()
				this.score.TWO += 1
            }
			else if (this.ball.ballX > this.player1bar.x + this.player1bar.width) {
				this.ball.serve += 1
				this.ball.init()
				this.score.ONE += 1
            }
        }
    }

	checkScore() {
		if (this.score.ONE == this.score.TWO && this.score.ONE > 9) {
			this.score.WIN = this.score.ONE + 2
        }
		if (this.mode == "one" && this.status == "match1") {
			if (this.score.ONE > this.score.TWO && this.score.ONE == this.score.WIN)
				this.winner = this.player0.name
			else if (this.score.ONE < this.score.TWO && this.score.TWO == this.score.WIN)
				this.winner = this.player1.name
        }
		else if (this.mode == "one" && this.status == "match2") {
			if (this.score.ONE > this.score.TWO && this.score.ONE == this.score.WIN)
				this.winner2 = this.player0.name
			else if (this.score.ONE < this.score.TWO && this.score.TWO == this.score.WIN)
				this.winner2 = this.player1.name
        }
		else if (this.mode == "one" && this.status == "match3") {
			if (this.score.ONE > this.score.TWO && this.score.ONE == this.score.WIN)
				this.winner3 = this.player0.name
			else if (this.score.ONE < this.score.TWO && this.score.TWO == this.score.WIN)
				this.winner3 = this.player1.name
        }
		else if (this.mode == "two") {
			if (this.score.ONE > this.score.TWO && this.score.ONE == this.score.WIN) {
				this.winner = this.player0.name
				this.winner2 = this.player1.name
            }
			else if (this.score.TWO > this.score.TWO && this.score.TWO == this.score.WIN) {
				this.winner = this.player2.name
				this.winner2 = this.player3.name 
            }
        }
    }  
}
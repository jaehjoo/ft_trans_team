export class Ball {
  constructor(view) {
    this.window = {
      WIDTH: view.WIDTH,
      HEIGHT: view.HEIGHT,
    };
    this.ball = {
      RADIUS: view.WIDTH / 100,
      X: view.WIDTH / 2,
      Y: view.HEIGHT / 2,
    };
    this.velocity = {
      X: 6,
      Y: 6,
    };
    this.serve = 0;
    this.ballColor;
  }

  init() {
    this.ball.X = this.window.WIDTH / 2;
    this.ball.Y = this.window.HEIGHT / 2;
    if (this.velocity.X < 0) this.velocity.X = -6;
    else this.velocity.X = 6;
    if (this.velocity.Y < 0) this.velocity.Y = -6;
    else this.velocity.Y = 6;
    if (this.serve == 2) {
      this.velocity.X *= -1;
      this.velocity.Y *= -1;
      this.serve = 0;
    }
  }

  update(x, y) {
    this.ball.X = x;
    this.ball.Y = y;
  }

  update_local() {
    this.ball.X += this.velocity.X;
    this.ball.Y += this.velocity.Y;
  }

  draw(context) {
    context.beginPath();
    context.arc(this.ball.X, this.ball.Y, this.ball.RADIUS, 0, Math.PI * 2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
  }
}

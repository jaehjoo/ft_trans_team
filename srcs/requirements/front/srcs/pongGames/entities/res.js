export class Result {
  constructor(view) {
    this.screen = {
      WIDTH: view.WIDTH,
      HEIGHT: view.HEIGHT,
      WIN: new Image(),
      LOSE: new Image(),
    };
    this.win = 0;
    this.screen.WIN.src = "../../img/games/win.png";
    this.screen.LOSE.src = "../../img/games/lose.png";
  }

  draw(context) {
    if (this.win == 1) {
      context.drawImage(this.screen.WIN, 0, 0);
    }
    if (this.win == 2) {
      context.drawImage(this.screen.LOSE, 0, 0);
    }
  }

  draw_local(context, winner) {
    context.draw
  }
}

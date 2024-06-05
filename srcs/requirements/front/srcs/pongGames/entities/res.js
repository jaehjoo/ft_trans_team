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

  draw_local(context, type) {
    let printStr;

    if (type == "one") {
      if (this.win == 1)
        printStr = "Player1";
      else
        printStr = "Player2";
      context.fillStyle = "black";
      context.fillRect(0, 0, 1024, 768);

      context.fillStyle = "white";
      context.font = "70px serif";
      context.fillText(printStr, this.screen.WIDTH / 2, this.screen.HEIGHT / 3);
      context.fillText("WIN", this.screen.WIDTH / 2, this.screen.HEIGHT / 3 * 2);
    }
    if (type == "team") {
      if (this.win == 1)
        printStr = "Player1, 2";
      else
        printStr = "Player3, 4";
        context.fillStyle = "black";
        context.fillRect(0, 0, 1024, 768);
  
        context.fillStyle = "white";
        context.font = "70px serif";
        context.fillText(printStr, this.screen.WIDTH / 2, this.screen.HEIGHT / 3);
        context.fillText("WIN", this.screen.WIDTH / 2, this.screen.HEIGHT / 3 * 2);
    }
  }
}

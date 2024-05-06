export class Wait {
  constructor(view) {
    this.screen = {
      WIDTH: view.WIDTH,
      HEIGHT: view.HEIGHT,
      IMAGE: new Image(),
    };

    this.screen.IMAGE.src = "../../img/games/waiting.png";
  }

  draw(context) {
    context.drawImage(this.screen.IMAGE, 0, 0);
  }
}

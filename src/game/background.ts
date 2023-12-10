
import { Rect } from "../engine/rect";
import { SpriteRenderer } from "../engine/sprite.renderer";
import { Texture } from "../engine/texture";

const SPEED = 0.25;

export class Background {
  private drawRect: Rect;
  private drawRectRepetition: Rect;
  private background: Texture;

  constructor(background: Texture, private gameWidth: number, private gameHeight: number) {
    this.drawRect = new Rect(0, 0, gameWidth, gameHeight);
    this.drawRectRepetition = new Rect(0, -gameHeight, gameWidth, gameHeight);
    this.background = background;
  }

  update(dt: number) {
    this.drawRect.y += SPEED * dt;
    this.drawRectRepetition.y = this.drawRect.y - this.drawRectRepetition.height;

    if (this.drawRect.y > this.gameHeight) {
      const temp = this.drawRect;
      this.drawRect = this.drawRectRepetition;
      this.drawRectRepetition = temp;
    }
  }

  draw(spriteRenderer: SpriteRenderer) {
    
    spriteRenderer.drawSprite(this.background, this.drawRect);
    spriteRenderer.drawSprite(this.background, this.drawRectRepetition);
  }
}

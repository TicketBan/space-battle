import { CircleCollider } from "../../engine/circle.collider";
import { Rect } from "../../engine/rect";
import { SpriteRenderer } from "../../engine/sprite.renderer";

export interface Enemy {
  active: boolean;
  drawRect: Rect;
  readonly collider: CircleCollider;

  update(dt: number): void;
  draw(spriteRenderer: SpriteRenderer): void;
}

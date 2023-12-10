import { CircleCollider } from "../../engine/circle.collider";
import { Rect } from "../../engine/rect";
import { SpriteRenderer } from "../../engine/sprite.renderer";
import { Texture } from "../../engine/texture";
import { Player } from "../player";
import { SpriteSheet } from "../../engine/spriteSheet";


const BULLET_SPEED = 0.75;

export class Bullet {
    public readonly drawRect: Rect;
    private sourceRect: Rect;
    private texture: Texture;

    public active = true;
    public collider = new CircleCollider();

    constructor(spriteSheet: SpriteSheet) {
        const sprite = spriteSheet.sprites["laserBlue01"];
        this.texture = sprite.texture;
        this.sourceRect = sprite.sourceRect.copy();
        this.drawRect = sprite.drawRect.copy();
    }

    public spawn(player: Player)
    {
        this.active = true;
        this.drawRect.x = player.drawRect.x + player.drawRect.width / 2 - this.drawRect.width / 2;
        this.drawRect.y = player.drawRect.y - this.drawRect.height;
    }

    public update(dt: number) {
        this.drawRect.y -= BULLET_SPEED * dt;
        this.collider.update(this.drawRect);

        if(this.drawRect.y  + this.drawRect.height < 0)
        {
            this.active = false;
        }
    }

    public draw(spriteRenderer: SpriteRenderer) {
        spriteRenderer.drawSpriteSource(this.texture, this.drawRect, this.sourceRect);
    }
}
import { SpriteRenderer } from "../../engine/sprite.renderer";
import { Player } from "../player";
import { Bullet } from "./bullet";
import { Enemy } from "../Enemy/enemy";
import { SpriteSheet } from "../../engine/spriteSheet";
import { InputManager } from "../../engine/input.manager";

const SPAWN_TIME = 150;

export class BulletManager 
{
    private pool : Bullet[] = [];
    private timeToSpawn = 0;

    constructor(private inputManager: InputManager,private readonly player: Player, private spriteSheet: SpriteSheet)
    {
    }

    public create() 
    {
        let bullet = this.pool.find(e => !e.active);
        if(!bullet)
        {
            bullet = new Bullet(this.spriteSheet);
            this.pool.push(bullet);
        }

        bullet.spawn(this.player);
    }

    public intersectsEnemy(enemy: Enemy) : boolean
    {
        for(const bullet of this.pool)
        {
            if(bullet.active && bullet.collider.intersects(enemy.collider))
            {
                bullet.active = false;
                return true;
            }
        }

        return false;
    }

    public update(dt: number)
    {
        if(this.inputManager.isKeyDown(" "))
        {
            this.timeToSpawn += dt;

            if(this.timeToSpawn > SPAWN_TIME)
            {
                this.timeToSpawn = 0;
                this.create();
            }
        }
        for(const bullet of this.pool)
        {
            if(bullet.active)
            {
                bullet.update(dt);
            }
        }
    }

    public draw(spriteRenderer: SpriteRenderer)
    {
        for(const bullet of this.pool)
        {
            if(bullet.active)
            {
                bullet.draw(spriteRenderer);
            }
        }
    }

}
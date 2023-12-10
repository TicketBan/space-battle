import { SpriteSheet } from "../../engine/spriteSheet";
import { SpriteRenderer } from "../../engine/sprite.renderer";
import { Player } from "../player";
import { Enemy } from "./enemy";
import { MeteorEnemy } from "./meteor-enemy";
import { BulletManager } from "../Bullet/bulletManager";

const SPAWN_INTERVAL = 1000;

export class EnemyManager {
  private timeToSpawn = 0;
  private pool: Enemy[] = [];
  constructor(private readonly sprite: SpriteSheet ,private readonly player: Player, private readonly bulletManager: BulletManager,private gameWidth: number, private gameHeight: number) {}

  public spawnEnemy() {
    if (this.timeToSpawn > SPAWN_INTERVAL) {
      this.timeToSpawn = 0;
      let enemy = this.pool.find(e => !e.active);

      if (!enemy) {
        enemy = new MeteorEnemy(this.sprite, this.gameWidth, this.gameHeight);
        this.pool.push(enemy);
      }

      enemy.active = true;
      enemy.drawRect.x = Math.random() * (this.gameWidth - enemy.drawRect.width);
      enemy.drawRect.y = -enemy.drawRect.height;
    }
  }

  public update(dt: number) {
    this.timeToSpawn += dt;
    this.spawnEnemy();

    for (const enemy of this.pool) {
      if (enemy.active) {
        enemy.update(dt);

        if (enemy.collider.intersects(this.player.collider)) {
          // this.player.active = false;
        }

        if(this.bulletManager.intersectsEnemy(enemy))
        {
            enemy.active = false;
        }

        if (enemy.drawRect.y > this.gameHeight) {
          // this.player.active = false;
        }
      }
    }
  }

  public draw(spriteRenderer: SpriteRenderer) {
    for (const enemy of this.pool) {
      if (enemy.active) {
        enemy.draw(spriteRenderer);
      }
    }
  }
}

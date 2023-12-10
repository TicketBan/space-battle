import { Engine } from "../engine/engine";
import { EnemyManager } from "./Enemy/enemy.manager";
import { Background } from "./background";
import { Player } from "./player";
import { SpriteSheet } from "../engine/spriteSheet";
import { Texture } from "../engine/texture";
import { BulletManager } from "./Bullet/bulletManager";

const engine = new Engine();
engine.initialize().then(async () => {
  const sprite = await loadSpriteSheet();
  const background = await loadBackground();
  const player = new Player(sprite, engine.inputManager, engine.gameBounds[0], engine.gameBounds[1]);
  const bulletManager = new BulletManager(engine.inputManager,player, sprite);
  const enemyManager = new EnemyManager(sprite, player, bulletManager, engine.gameBounds[0], engine.gameBounds[1]);

  engine.onUpdate = (dt: number) => {
    player.update(dt);
    background.update(dt);
    enemyManager.update(dt);
    bulletManager.update(dt);
  };

  engine.onDraw = () => {
    background.draw(engine.spriteRenderer);
    player.draw(engine.spriteRenderer);
    enemyManager.draw(engine.spriteRenderer);
    bulletManager.draw(engine.spriteRenderer);
  };
  engine.draw();
});

async function loadSpriteSheet() {
  const sprite = new SpriteSheet();
  await sprite.loadSpriteSheet(engine.device, "assets/Spritesheet/sheet.png");
  return sprite;
}

async function loadBackground() {
  const backgroundTexture = await Texture.createTextureFromURL(engine.device, "assets/Backgrounds/blue.png");
  const background = new Background(backgroundTexture, engine.gameBounds[0], engine.gameBounds[1]);

  return background;
}

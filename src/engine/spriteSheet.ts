import { Rect } from "./rect";
import { Sprite } from "./sprite";
import { Texture } from "./texture";


export class SpriteSheet {
  public  sprites: { [id: string]: Sprite } = {};
  public  async loadSpriteSheet(device: GPUDevice, pach :string) {

    const spriteSheet = await Texture.createTextureFromURL(device, pach);
    
    const sheetXmlReq = await fetch("assets/SpriteSheet/sheet.xml");
    const sheetXmlText = await sheetXmlReq.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sheetXmlText, "text/xml");

    xmlDoc.querySelectorAll("SubTexture").forEach(subTexture => {
      const name = subTexture.getAttribute("name")!.replace(".png", "");
      const x = parseInt(subTexture.getAttribute("x")!);
      const y = parseInt(subTexture.getAttribute("y")!);
      const width = parseInt(subTexture.getAttribute("width")!);
      const height = parseInt(subTexture.getAttribute("height")!);

      const drawRect = new Rect(0, 0, width, height);
      const sourceRect = new Rect(x, y, width, height);

      this.sprites[name] = new Sprite(spriteSheet, drawRect, sourceRect);
    });
  }

}

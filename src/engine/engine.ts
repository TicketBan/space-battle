import { vec2 } from "gl-matrix";
import { SpriteSheet } from "./spriteSheet";
import { InputManager } from "./input.manager";
import { SpriteRenderer } from "./sprite.renderer";

export class Engine {
  private lastTime = 0;
  private canvas!: HTMLCanvasElement;
  private context!: GPUCanvasContext;
  public device!: GPUDevice;
  public spriteRenderer!: SpriteRenderer;

  private passEncoder!: GPURenderPassEncoder;
  public inputManager!: InputManager;
  public gameBounds = vec2.create();

  public onStart: (dt: number) => void = () => {};
  public onUpdate: (dt: number) => void = () => {};
  public onDraw: () => void = () => {};

  constructor() {}

  public async initialize(): Promise<void> {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("webgpu") as GPUCanvasContext;

    this.gameBounds[0] = this.canvas.width;
    this.gameBounds[1] = this.canvas.height;

    if (!this.context) {
      console.error("WebGPU not supported");
      alert("WebGPU not supported");
      return;
    }

    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      console.error("No adapter found");
      alert("No adapter found");
      return;
    }

    this.device = await adapter.requestDevice();

    await this.Start();


    this.context.configure({
      device: this.device,
      format: navigator.gpu.getPreferredCanvasFormat()
    });

    this.spriteRenderer = new SpriteRenderer(this.device, this.canvas.width, this.canvas.height);
    this.spriteRenderer.initialize();
    this.inputManager = new InputManager();
  }


  private async Start(){


  }
  rotation = 0;

  public draw(): void {
    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    this.onUpdate(dt);

    const commandEncoder = this.device.createCommandEncoder();

    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
          view: this.context.getCurrentTexture().createView()
        }
      ]
    };

    this.passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

    this.spriteRenderer.framePass(this.passEncoder);

    // DRAW HERE

    this.onDraw();
    this.spriteRenderer.frameEnd();

    // END DRAW HERE
    this.passEncoder.end();
    this.device.queue.submit([commandEncoder.finish()]);

    window.requestAnimationFrame(() => this.draw());
  }
}

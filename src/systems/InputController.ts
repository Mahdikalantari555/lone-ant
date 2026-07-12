import Phaser from "phaser";

export interface TapRequest {
  x: number;
  y: number;
}

export class InputController {
  private handler?: (req: TapRequest) => void;

  constructor(private scene: Phaser.Scene) {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
  }

  onTap(handler: (req: TapRequest) => void): void {
    this.handler = handler;
  }

  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (!this.handler) return;
    const world = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    this.handler({ x: world.x, y: world.y });
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_DOWN, this.onPointerDown, this);
  }
}

import { Container, Graphics } from 'pixi.js';

export default class Box extends Container {
  constructor({
    position: { x, y },
    sizes: { width, height }
  }) {
    super()

    const graphics = new Graphics()
    graphics.beginFill(0xC31212, 1)
    graphics.drawRect(x+width*32, y+height*32, width*64, height*64)
    graphics.endFill()

    this.addChild(graphics)
  }
}
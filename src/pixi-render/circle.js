import { Container, Graphics } from 'pixi.js';

export default class Circle extends Container {
  constructor() {
    super()

    const graphics = new Graphics()
    graphics.beginFill(0xC34288, 1)
    graphics.drawCircle(450, 250, 50)
    graphics.endFill()

    this.addChild(graphics)
  }

  move(x = 0, y = 0) {
    this.x += x
    this.y += y
  }
}
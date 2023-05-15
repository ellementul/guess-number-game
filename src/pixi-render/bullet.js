import { Container, Graphics } from 'pixi.js';

export default class Bullet extends Container {
  constructor({ position, radius }) {
    super()

    const graphics = new Graphics()
    graphics.beginFill(0xC34288, 1)
    graphics.drawCircle(position.x, position.y, radius * 2)
    graphics.endFill()

    this.addChild(graphics)
  }
}
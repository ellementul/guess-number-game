import { Container, Graphics } from 'pixi.js';

export default class Box extends Container {
  constructor({ w, h }) {
    super()

    const graphics = new Graphics()
    graphics.beginFill(0xC34288, 1)
    graphics.drawRect(0, 0, w, h)
    graphics.endFill()

    this.addChild(graphics)
  }
}
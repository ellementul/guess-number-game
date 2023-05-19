import { Container, Graphics } from 'pixi.js';

export default class Box extends Container {
  constructor({ position: { row, column } }) {
    super()

    const tileSize = 64

    const graphics = new Graphics()
    graphics.beginFill(0x12C312, 1)
    graphics.drawRect(row * tileSize, column * tileSize, tileSize, tileSize)
    graphics.endFill()

    this.addChild(graphics)
  }
}
import { Container, Graphics } from 'pixi.js';

export default class Grid extends Container {
  constructor() {
    super()

    const graphics = new Graphics()
    graphics.beginFill(0xC31212, 1)

    const tileSize = 64
    const rowCount = 8
    const columnCount = 8

    for(let i = 0; i <= rowCount; i++){
      graphics.drawRect(i*tileSize, 0, 2, tileSize*columnCount)
    }

    for(let i = 0; i <= columnCount; i++){
      graphics.drawRect(0, i*tileSize, tileSize*rowCount, 2)
    }

    graphics.endFill()

    this.addChild(graphics)
  }
}
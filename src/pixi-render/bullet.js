import { Container, Graphics } from 'pixi.js';

export default class Bullet extends Container {
  constructor({ position, radius }) {
    super()

    const graphics = new Graphics()
    graphics.beginFill(0xC34288, 1)
    graphics.drawCircle(position.x, position.y, radius * 2)
    graphics.endFill()

    this.addChild(graphics)

    this.velocity = {
      x: 0,
      y: 0
    }
  }

  setPosition({ position, velocity }) {
    this.position.set(position.x, position.y)
    this.velocity = velocity
  }

  // step(delta) {
  //   let diffX = delta * this.velocity.x
  //   let diffY = delta * this.velocity.y

  //   if(diffX == 0 && diffY == 0) return

  //   this.position.set(this.position.x + diffX, this.position.y + diffY)
  // }
}
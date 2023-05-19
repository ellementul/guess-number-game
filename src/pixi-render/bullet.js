import { Container, Graphics } from 'pixi.js';

export default class Bullet extends Graphics {
  constructor({ position, radius }) {
    super()

    this.beginFill(0xC34288, 1)
    this.drawCircle(position.x, position.y, radius  )
    this.endFill()

    this.pivot.x = this.width * 0.5
    this.pivot.y = this.height * 0.5
    this.position.set(position.x, position.y)

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
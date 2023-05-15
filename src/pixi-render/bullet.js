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

  setPosition({ delta, position: newPosition, velocity: currentVelocity }) {
    if(delta == 0) {
      this.position.set(newPosition.x, newPosition.y)
      this.velocity = currentVelocity
      return
    }

    const diffX = newPosition.x - this.position.x
    const diffY = newPosition.y - this.position.y
    console.log('check', diffX, diffY)

    this.velocity = {
      x: ((diffX * 10) / delta) + currentVelocity.x,
      y: ((diffY * 10) / delta) + currentVelocity.y,
    }
  }

  step(delta) {
    let diffX = delta * this.velocity.x
    let diffY = delta * this.velocity.y

    if(diffX == 0 && diffY == 0) return

    this.position.set(this.position.x + diffX, this.position.y + diffY)
  }
}
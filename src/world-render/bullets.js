import { Texture, Sprite } from "pixi.js";


export default class Bullets {
  constructor (view) {
    this.view = view
    this.bullets = new Map

    this.texture = Texture.from('img/ball.png')
  }

  create({ uuid, position, velocity }) {
    const bullet = new Bullet(this.texture, position)

    this.view.addChild(bullet)
    this.bullets.set(uuid, bullet)
  }

  update(objects) {
    objects.forEach(({ uuid, position, velocity }) => {
      const bullet = this.bullets.get(uuid)
      bullet.setPosition(position)
    })
  }

  // step(delta) {
  //   let diffX = delta * this.velocity.x
  //   let diffY = delta * this.velocity.y

  //   if(diffX == 0 && diffY == 0) return

  //   this.position.set(this.position.x + diffX, this.position.y + diffY)
  // }
}

class Bullet extends Sprite {
  constructor(texture, position, velocity) {
    super(texture)

    this.anchor.set(0.5)
    this.scale.set(0.5)

    this.x = position.x
    this.y = position.y

    // this.velocity = {
    //   x: velocity.x,
    //   y: velocity.y
    // }
  }

  setPosition({ x, y }) {
    this.x = x
    this.y = y
  }
}
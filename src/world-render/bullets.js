import { Texture, Sprite } from "pixi.js";


export default class Bullets {
  constructor (view) {
    this.view = view
    this.bullets = new Map

    this.textures = {
      "Red": Texture.from('img/ball_red.png'),
      "Green": Texture.from('img/ball_green.png'),
      "Yellow": Texture.from('img/ball_yellow.png')
    }
  }

  create({ uuid, position, velocity, color }) {
    const bullet = new Bullet(this.textures[color], position, velocity)

    this.view.addChild(bullet)
    this.bullets.set(uuid, bullet)
  }

  update(objects) {
    objects.forEach(({ uuid, position, velocity }) => {
      const bullet = this.bullets.get(uuid)
      bullet.setPosition(position)
      bullet.velocity = velocity
    })
  }

  intro(delta) {
    for (const [uuid, bullet] of this.bullets)
      bullet.move(delta)
  }
}

class Bullet extends Sprite {
  constructor(texture, position, velocity) {
    super(texture)

    this.anchor.set(0.5)
    // this.scale.set(0.5)

    this.x = position.x
    this.y = position.y

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }
  }

  setPosition({ x, y }) {
    this.x = x
    this.y = y
  }

  move(delta) {
    console.log(delta, Math.abs(this.velocity.x) + Math.abs(this.velocity.y))
    let diffX = delta * this.velocity.x
    let diffY = delta * this.velocity.y

    if(diffX == 0 && diffY == 0) return

    this.position.set(this.position.x + diffX, this.position.y + diffY)
  }
}
const { Member } = require('@ellementul/uee-core')
const timeEvent = require('../events/game_tick_event.js')
const updateWorldEvent = require('../events/updated_world_event')
const createdBulletEvent = require('../events/create_bullet_event.js')
const createdBoxEvent = require('../events/create_box_event.js')
const startEvent = require('../events/game_start_event')

const { PhysicEngine } = require('./engine')

export default class World extends Member {
  constructor() {
    super()
    
    const widthMap = 512
    const heightMap = 512
    const tileSize = 64

    this.physic = new PhysicEngine(widthMap, heightMap, tileSize)

    this.bullet = new Set

    this.isRun = false
    this.mstime = Date.now()

    this.onEvent(startEvent, () => this.run())
    this.onEvent(createdBulletEvent, payload => this.createBullet(payload))
    this.onEvent(createdBoxEvent, payload => this.createTileBox(payload))
  }

  createBullet({ uuid: uid, position, velocity, radius }) {
    const polygon = [
      { x: position.x, y: position.y + radius },
      { x: position.x + radius, y: position.y },
      { x: position.x, y: position.y - radius },
      { x: position.x - radius, y: position.y }
    ]

    this.physic.addDynamicObject({
      uid,
      polygon,
      velocity
    })

    this.bullet.add(uid)
  }

  createTileBox({ uuid, position }) {
    this.physic.addTiledObject({ uid: uuid, position })
  }

  run() {
    if(this.isRun == true) return
    this.isRun = true

    this.onEvent(timeEvent, payload => this.generateEvents(payload))

    this.time = Date.now()
    this.timer = setInterval(() => this.step(), 0)
  }

  step() {
    const newTime = Date.now()
    const deltaTime = newTime - this.time

    this.physic.step(deltaTime)

    this.time = newTime
  }

  generateEvents() {
    this.step()

    const objects = this.physic.getObjectList()
      .map(({uid, position, velocity}) => ({uuid: uid, position, velocity}))

    if(objects.length > 0)
      this.send(updateWorldEvent, {
        state: objects
      })
  }
}
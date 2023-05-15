const { Member } = require('@ellementul/uee-core')
const timeEvent = require('../events/time_event')
const updateWorldEvent = require('../events/updated_world_event')
const createdObjectEvent = require('../events/create_object_event')
const startEvent = require('../events/game_start_event')

const { PhysicEngine } = require('./engine')

export default class World extends Member {
  constructor() {
    super()
    
    const widthMap = 1024
    const heightMap = 1024

    this.physic = new PhysicEngine(widthMap, heightMap)

    this.bullet = new Set

    this.isRun = false
    this.mstime = Date.now()

    this.onEvent(startEvent, () => this.run())
    this.onEvent(createdObjectEvent, payload => this.create(payload))
  }

  create({
    entity,
    state: {
      uuid,
      position,
      radius
    }
  }) {
    if(entity == "Bullet")
      this.createBullet(uuid, position, radius)
  }

  createBullet(uid, position, radius) {
    const velocity = { x: 512, y: 512 }

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

  run() {
    if(this.isRun == true) return
    this.isRun = true

    this.onEvent(timeEvent, payload => this.generateEvents(payload))

    this.time = Date.now()
    this.timer = setInterval(() => this.step(), 10)
  }

  step() {
    const newTime = Date.now()
    const deltaTime = newTime - this.time

    this.physic.step(deltaTime)

    this.time = newTime
  }

  generateEvents({ state: { mstime } }) {

    let deltaMstime = mstime - this.mstime

    if(deltaMstime < 0)
      deltaMstime = 0

    const objects = this.physic.getObjectList()
      .map(({uid, position}) => ({uuid: uid, position}))

    if(objects.length > 0)
      this.send(updateWorldEvent, {
        delta: deltaMstime,
        state: objects
      })

    this.mstime = mstime
  }
}
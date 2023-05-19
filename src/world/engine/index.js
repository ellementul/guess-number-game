const { SectionCoordinates } = require('./section-coordinates');
const { TileMap } = require('./tile-map');

class PhysicEngine {
  constructor(width, height, tileSize) {
    this.sectionCoordinates = new SectionCoordinates(width, height)
    this.tileMap = new TileMap(width, height, tileSize)

    this.dynamicObjects = new Map()

    this.limit = {
      beginX: 0,
      beginY: 0,
      endX: width,
      endY: height
    }
  }

  massCenter(polygon) {
    const l = polygon.length

    const position = polygon.reduce(function(center, p, i) {
      center.x += p.x
      center.y += p.y

      if(i === l - 1) {
          center.x /= l
          center.y /= l
      }

      return center
    }, {x: 0, y: 0})

    const minX = Math.min(...polygon.map(point => point.x))
    const minY = Math.min(...polygon.map(point => point.x))
    const maxX = Math.max(...polygon.map(point => point.x))
    const maxY = Math.max(...polygon.map(point => point.x))

    const collide = {
      x1: minX,
      x2: maxX,
      y1: minY,
      y2: maxY
    }

    return { position, collide }
  }

  addDynamicObject({ uid, polygon, velocity }) {
    if(this.dynamicObjects.has(uid)) return;

    if(polygon.some(point => this.checkOutLimitMap(point)))
      throw new TypeError("OutMapLimitWhileCreatingObject")

    const { position, collide } = this.massCenter(polygon)

    this.dynamicObjects.set(uid, {
      polygon,
      position,
      collide,
      velocity: {
        x: velocity.x * 0.001, // second to millisecond
        y: velocity.y * 0.001
      }
    })
  }

  addTiledObject({ uid, position }) {
    this.tileMap.addBox({ uid, position })
  }

  addSensor({ uid, radius }) {

  }

  remove(uid) {
    this.dynamicObjects.delete(uid)
  }

  checkOutLimitMap(position) {
    if(this.limit.beginX > position.x) return true;
    if(this.limit.beginY > position.y) return true;

    if(this.limit.endX < position.x) return true;
    if(this.limit.endY < position.y) return true;

    return false;
  }

  checkPoints(a1, a2, b1, b2) {
    if(a1 < b1) {
      return (b1 < a2)
    }
    else {
      return (a1 < b2)
    }
  }

  checkCollision(objectUidA, objectUidB){
    const objectA = this.dynamicObjects.get(objectUidA)
    const objectB = this.dynamicObjects.get(objectUidB)

    if(!objectA.velocity.x && !objectA.velocity.y) return;

    if(!this.checkPoints(
      objectA.collide.x1,
      objectA.collide.x2,
      objectB.collide.x1,
      objectB.collide.x2
    )) return

    if(!this.checkPoints(
      objectA.collide.y1,
      objectA.collide.y2,
      objectB.collide.y1,
      objectB.collide.y2
    )) return

    return {
      x: objectA.position.x - objectB.position.x,
      y: objectA.position.y - objectB.position.y
    }
  }

  resolveCollisions(){

  }

  processCollisions(uid){
    const nearerObjects = this.sectionCoordinates.getNearerObjects(uid)
    const collisions = nearerObjects
      .forEach(nearObjectUid => this.checkCollision(uid, nearObjectUid))
      .filter(collision => !!collision)
    this.resolveCollisions(uid, collisions)
  }

  moveObject(uid, deltaTime) {
    const object = this.dynamicObjects.get(uid)

    if(!!object.velocity.x)
      object.position.x += object.velocity.x * deltaTime

    if(!!object.velocity.y)
      object.position.y += object.velocity.y * deltaTime

    if(this.checkOutLimitMap(object.position))
      this.remove(uid)

    this.sectionCoordinates.upsert(uid, object.position)
  }

  step(deltaTime){
    this.sectionCoordinates.clear()

    for(let [uid, object] of this.dynamicObjects)
      this.moveObject(uid, deltaTime)

    // for(let [uid, object] of this.dynamicObjects)
    //   this.processCollisions(uid)
  }

  getObjectList(){
    const objects = []
    for(let [uid, { position, velocity }] of this.dynamicObjects) {
      objects.push({
        uid,
        position: {
           x: Math.round(position.x),
           y: Math.round(position.y)
        },
        velocity: {
          x: Math.round(velocity.x * 1000) / 1000,
          y: Math.round(velocity.y * 1000) /1000
        }
      })
    }

    return objects
  }
}

module.exports = { PhysicEngine }
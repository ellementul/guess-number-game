import { calc, ipoint, point } from "@js-basics/vector";

const { System } = require("detect-collisions")

const { SectionCoordinates } = require('./section-coordinates');
const { TileMap } = require('./tile-map');

class PhysicEngine {
  constructor(width, height, tileSize) {
    // this.sectionCoordinates = new SectionCoordinates(width, height)
    this.tileMap = new TileMap(width, height, tileSize)

    this.dynamicObjects = new Map()

    this.collisionSystem = new System()

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
    }, point(0, 0))

    const beginPoint = polygon[0]
    const clacLocalPoint = polygonPoint => {
      return point(polygonPoint.x - beginPoint.x, polygonPoint.y - beginPoint.y)
    }
    const points = polygon.map(clacLocalPoint)

    return { position, points }
  }

  addDynamicObject({ uid, polygon, velocity }) {
    if(this.dynamicObjects.has(uid)) return;

    if(polygon.some(point => this.checkOutLimitMap(point)))
      throw new TypeError("OutMapLimitWhileCreatingObject")

    const { position, points } = this.massCenter(polygon)

    const body = this.collisionSystem.createPolygon(position, points)
    body.uid = uid
    body.velocity = point(velocity.x * 0.001, velocity.y * 0.001)
    body.path = {
      lastPoint: position,
      nextPoint: position
    }

    this.dynamicObjects.set(uid, body)
  }

  addTiledObject({ uid, position }) {
    this.tileMap.addBox({ uid, position })
  }

  addSensor({ uid, radius }) {

  }

  remove(uid) {
    console.log('Removed object', uid)
    this.collisionSystem.remove(this.dynamicObjects.get(uid))
    this.dynamicObjects.delete(uid)
  }

  checkOutLimitMap(position) {
    if(this.limit.beginX > position.x) return true;
    if(this.limit.beginY > position.y) return true;

    if(this.limit.endX < position.x) return true;
    if(this.limit.endY < position.y) return true;

    return false;
  }

  // checkPoints(a1, a2, b1, b2) {
  //   if(a1 < b1) {
  //     return (b1 < a2)
  //   }
  //   else {
  //     return (a1 < b2)
  //   }
  // }

  // checkCollision(objectUidA, objectUidB){
  //   const objectA = this.dynamicObjects.get(objectUidA)
  //   const objectB = this.dynamicObjects.get(objectUidB)

  //   if(!objectA.velocity.x && !objectA.velocity.y) return;

  //   if(!this.checkPoints(
  //     objectA.collide.x1,
  //     objectA.collide.x2,
  //     objectB.collide.x1,
  //     objectB.collide.x2
  //   )) return

  //   if(!this.checkPoints(
  //     objectA.collide.y1,
  //     objectA.collide.y2,
  //     objectB.collide.y1,
  //     objectB.collide.y2
  //   )) return

  //   return {
  //     x: objectA.position.x - objectB.position.x,
  //     y: objectA.position.y - objectB.position.y
  //   }
  // }

  resolveCollisions({ type, object, crosspoint, reflectNormal}) {
    if(type === "Tiled")
      object.setPosition(crosspoint.x, crosspoint.y)

    if(object.velocity.x == 0 && object.velocity.y == 0)
      return

    const dotNorm = calc(() => reflectNormal.dot(object.velocity) / reflectNormal.dot(reflectNormal))
    const reflectVelosity = calc(() => object.velocity - 2 * dotNorm * reflectNormal)

    if(reflectVelosity.x !== 0 || reflectVelosity.y !== 0)
      object.velocity = point(reflectVelosity.x, reflectVelosity.y)
    else
      object.velocity = point(
        Math.abs(object.velocity.x) * Math.sign(reflectNormal.x) * -1,
        Math.abs(object.velocity.y) * Math.sign(reflectNormal.y) * -1
      )

    if(type !== "Tiled")
      console.log('object.velocity', object.uid, object.velocity.toString())
  }

  processCollisions(uid, object){
    const { isCollision, wallUid, crosspoint, reflectNormal } = this.tileMap.checkCollision(object.path)

    if(isCollision)
      this.resolveCollisions({ 
        type: "Tiled", 
        object, 
        crosspoint, 
        reflectNormal
      })

    // const nearerObjects = this.sectionCoordinates.getNearerObjects(uid)
    // const collisions = nearerObjects
    //   .forEach(nearObjectUid => this.checkCollision(uid, nearObjectUid))
    //   .filter(collision => !!collision)
    // this.resolveCollisions(uid, collisions)
  }

  moveObject(uid, deltaTime) {
    const object = this.dynamicObjects.get(uid)
    const velocity = object.velocity

    const lastPoint = ipoint(object.pos.x, object.pos.y)

    const newPosX = object.pos.x + velocity.x * deltaTime
    const newPosY = object.pos.y + velocity.y * deltaTime

    object.setPosition(newPosX, newPosY)


    if(this.checkOutLimitMap(object.pos))
      this.remove(uid)

    // this.sectionCoordinates.upsert(uid, object.position)

    object.path =  {
      lastPoint,
      nextPoint: ipoint(object.pos.x, object.pos.y)
    }
  }

  step(deltaTime){
    // this.sectionCoordinates.clear()

    for(let [uid, object] of this.dynamicObjects)
      this.moveObject(uid, deltaTime)

    for(let [uid, object] of this.dynamicObjects)
      this.processCollisions(uid, object)

    this.collisionSystem.checkAll(({ overlapN, overlapV, a: object }) => {
      this.resolveCollisions({ 
        type: "Bullet", 
        object, 
        crosspoint: ipoint(0, 0), 
        reflectNormal: overlapV
      })
    })
  }

  getObjectList(){
    const objects = []
    for(let [uid, { pos: position, velocity }] of this.dynamicObjects) {
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
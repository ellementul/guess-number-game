import { calc, ipoint, point } from "@js-basics/vector";

const { System } = require("detect-collisions")
const { TileMap } = require('./tile-map');

class PhysicEngine {
  constructor(width, height, tileSize) {
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

    console.log(uid)
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

  resolveCollisions({ type, object, crosspoint, reflectNormal}) {
    const dotNorm = calc(() => reflectNormal.dot(object.velocity) / reflectNormal.dot(reflectNormal))
    const reflectVelosity = calc(() => object.velocity - 2 * dotNorm * reflectNormal)

    if(reflectVelosity.x !== 0 || reflectVelosity.y !== 0)
      object.velocity = point(reflectVelosity.x, reflectVelosity.y)
    else
      object.velocity = point(
        object.velocity.x * -1,
        object.velocity.y * -1
      )

    // console.log(object.uid, object.velocity.length)
    object.setPosition(crosspoint.x, crosspoint.y)
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

    object.path =  {
      lastPoint,
      nextPoint: ipoint(object.pos.x, object.pos.y)
    }
  }

  step(deltaTime){

    for(let [uid, object] of this.dynamicObjects) {
      this.moveObject(uid, deltaTime)
      this.processCollisions(uid, object)
    }  

    this.collisionSystem.checkAll(({ overlapN, overlapV, a: objectA, b: objectB }) => {
      this.resolveCollisions({ 
        type: "Bullet", 
        object: objectA, 
        crosspoint: ipoint(objectA.pos.x - overlapV.x * 0.5,  objectA.pos.y - overlapV.y * 0.5),
        reflectNormal: ipoint(objectA.pos.x - objectB.pos.x, objectA.pos.y - objectB.pos.y)
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
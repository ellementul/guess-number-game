const createObjectEvent = require('../events/create_object_event')
const updatedEvent = require('../events/updated_world_event')

import { Application, Container } from 'pixi.js';
import Bullet from './bullet'

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container

const transformUnitToPixels = units => 1 * units

export default class World {
  constructor(onEvent) {
    const app = new Application({ width: window.innerWidth, height: window.innerHeight });  
    document.body.appendChild(app.view);

    app.stage.interactive = true
    app.stage.hitArea = app.screen

    this.view = new Container()
    app.stage.addChild(this.view)

    this.physicObjects = new Map()

    onEvent(createObjectEvent, payload => this.create(payload))
    onEvent(updatedEvent, payload => this.update(payload))
  }

  addPhysicObject(uuid, object) {
    this.view.addChild(object)
    this.physicObjects.set(uuid, object)
  }

  create({ entity, state: { uuid, position, radius } }) {
    let object

    switch (entity) {
      case "Bullet":
        object = new Bullet({
          position: { 
            x: transformUnitToPixels(position.x), 
            y: transformUnitToPixels(position.y) 
          },
          radius: transformUnitToPixels(radius)
        })
        break
    
      default:
        throw new TypeError('Unknown entity!')
    }
    object.pivot.x = object.width / 2
    object.pivot.y = object.height / 2
    
    object.position.set(transformUnitToPixels(position.x), transformUnitToPixels(position.x))
    this.addPhysicObject(uuid, object)
  }

  update({ state: objects }) {
    objects.forEach(({ uuid, position: { x, y } }) => {
      const object = this.physicObjects.get(uuid)
      object.position.set(transformUnitToPixels(x), transformUnitToPixels(y))
    })
  }
}
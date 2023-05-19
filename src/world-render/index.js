const createBulletEvent = require('../events/create_bullet_event')
const createBoxEvent = require('../events/create_box_event')
const updatedEvent = require('../events/updated_world_event')

import { Application, Container } from 'pixi.js';
import Bullets from './bullets'
import Box from './box';
import Grid from './grid';

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container

const transformUnitToPixels = units => 1 * units

export default class World {
  constructor(onEvent) {
    const app = new Application({ width: window.innerWidth, height: window.innerHeight });  
    document.body.appendChild(app.view);

    this.view = new Container()
    app.stage.addChild(this.view)

    this.view.addChild(new Grid)

    this.bullets = new Bullets(this.view)

    // app.ticker.add(delta => {})

    onEvent(createBulletEvent, payload => this.createBullet(payload))
    onEvent(createBoxEvent, payload => this.createBox(payload))
    onEvent(updatedEvent, payload => this.update(payload))
  }

  createBullet({ uuid, position, radius }) {
    this.bullets.create({
      uuid,
      position: { 
        x: transformUnitToPixels(position.x), 
        y: transformUnitToPixels(position.y) 
      },
      radius: transformUnitToPixels(radius)
    })
  }

  createBox({ uuid, position }) {
    const box = new Box({ position })
    this.view.addChild(box)
  }

  update({ state: objects }) {
    const updatedBullets = objects.map(({ uuid, position, velocity }) => {
      return ({
        uuid,
        position: { 
          x: transformUnitToPixels(position.x), 
          y: transformUnitToPixels(position.y) 
        },
        velocity: { 
          x: transformUnitToPixels(velocity.x), 
          y: transformUnitToPixels(velocity.y) 
        }
      })
    })
    this.bullets.update(updatedBullets)
  }
}
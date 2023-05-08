const { Member } = require('@ellementul/uee-core')
const timeEvent = require('../events/time_event')
const updateWorldEvent = require('../events/updated_world_event')
const createdObjectEvent = require('../events/create_object_event')


import * as planck from 'planck';

const formatNumber = number => +number.toFixed(2)

export default class World extends Member {
  constructor() {
    super()

    this.timeStep = Date.now();
    this.velocityIterations = 6;
    this.positionIterations = 2;
    let gravity = planck.Vec2(0.0, 0.0);

    this.world = planck.World({
      gravity: gravity,
    });

    this.bodies = new Map()

    // this.world.on('pre-solve', function(contact, contactImpulse) {
    //   console.log(contact.getFixtureB().getBody().getLinearVelocity(), contactImpulse.localNormal)
    // });

    this.onEvent(timeEvent, payload => this.step(payload))
    this.onEvent(createdObjectEvent, payload => this.create(payload))
  }

  create({ 
    state: { 
      uuid,
      dynamic,
      x,
      y,
      shape: { type, w, h }
    }
  }) {
    const body = this.world.createBody({
      type: dynamic ? "dynamic" : "static",
      position: planck.Vec2(x, y)
    });

    let shapeDef
    switch (type) {
      case "Box":
        shapeDef = planck.Box(w/2, h/2);
        break
    
      default:
        throw new TypeError('Unknown shape!')
    }

    let fixtureDef = {
      shape: shapeDef,
      density: 1,
      friction: 0,
    }

    if(dynamic)
      body.setLinearVelocity(planck.Vec2(0, 7))

    body.createFixture(fixtureDef)
    this.bodies.set(uuid, body)

    if(this.bodies.size > 1024)
      console.error("Too many objects!!!")
  }

  generateEvents() {
    const bodies = []
    for (let [uuid, body] of this.bodies) {
      const { x, y } = body.getPosition()
      bodies.push({
        uuid,
        x: formatNumber(x),
        y: formatNumber(y)
      })
    }

    this.send(updateWorldEvent, { state: bodies })
  }

  step({ state: { mstime } }) {
    const delta =  mstime - this.timeStep
    this.timeStep = mstime

    this.world.step(delta/1000, this.velocityIterations, this.positionIterations);
    this.generateEvents()
  }
}
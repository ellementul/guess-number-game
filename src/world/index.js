const { Member } = require('@ellementul/uee-core')
const timeEvent = require('../events/time_event')
const updateWorldEvent = require('../events/updated_world_event')
const createdObjectEvent = require('../events/create_object_event')


import * as planck from 'planck';

const formatNumber = number => +number.toFixed(2)

export default class World extends Member {
  constructor() {
    super()
    

    // this.onEvent(timeEvent, payload => this.generateEvents(payload))
    // this.onEvent(createdObjectEvent, payload => this.create(payload))
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
    
  }

  generateEvents({ state: { mstime } }) {
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

  step() {
    
  }
}
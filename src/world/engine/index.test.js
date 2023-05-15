const { PhysicEngine } = require('./')

describe('Physic Engine', () => {
  let engine
  beforeEach(() => {
    engine = new PhysicEngine(1024, 1024)
  })
  test('Create and deleted object', () => {
    const uid = 567
    const polygon = [
      { x: 10, y: 10},
      { x: 15, y: 10},
      { x: 15, y: 15},
      { x: 10, y: 15}
    ]
    const velocity = { x: 0, y: 0 }

    engine.addDynamicObject({
      uid,
      polygon,
      velocity
    })

    console.log(engine.getObjectList())

    engine.remove(uid)
  });
});
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
    const velocity = { x: 5, y: 5 }

    const position = {
      x: Math.round((polygon[0].x + polygon[2].x)/2),
      y: Math.round((polygon[0].y + polygon[2].y)/2)
    }

    engine.addDynamicObject({
      uid,
      polygon,
      velocity
    })

    expect(engine.getObjectList()).toEqual([{ uid, position, velocity }])

    engine.remove(uid)

    expect(engine.getObjectList()).toEqual([])
  })

  test("Out Map Limit while creating", () => {
    const uid = 567
    // Out limit
    const polygon = [
      { x: 1024, y: 1024},
      { x: 1524, y: 1024},
      { x: 1524, y: 1524},
      { x: 1024, y: 1524}
    ]
    const velocity = { x: 0, y: 0 }

    const addingFunction = () => engine.addDynamicObject({
      uid,
      polygon,
      velocity
    })

    expect(addingFunction).toThrow("OutMapLimit")
  })

  test('Moving', () => {
    const uid = 567
    const polygon = [
      { x: 10, y: 10},
      { x: 15, y: 10},
      { x: 15, y: 15},
      { x: 10, y: 15}
    ]
    const velocity = { x: 20, y: 20 }

    const oldPosition = {
      x: Math.round((polygon[0].x + polygon[2].x)/2),
      y: Math.round((polygon[0].y + polygon[2].y)/2)
    }

    const newPosition = {
      x: Math.round((polygon[0].x + polygon[2].x)/2 + 5),
      y: Math.round((polygon[0].y + polygon[2].y)/2  + 5)
    }

    engine.addDynamicObject({
      uid,
      polygon,
      velocity
    })

    expect(engine.getObjectList()).toEqual([{ uid, position: oldPosition, velocity }])

    engine.step(250)

    expect(engine.getObjectList()).toEqual([{ uid, position: newPosition, velocity }])
  })

  test('Moving Out Map', () => {
    const uid = 567
    const polygon = [
      { x: 0, y: 0},
      { x: 5, y: 0},
      { x: 5, y: 5},
      { x: 0, y: 5}
    ]
    const velocity = { x: -20, y: -20 }

    const oldPosition = {
      x: Math.round((polygon[0].x + polygon[2].x)/2),
      y: Math.round((polygon[0].y + polygon[2].y)/2)
    }

    engine.addDynamicObject({
      uid,
      polygon,
      velocity
    })

    expect(engine.getObjectList()).toEqual([{ uid, position: oldPosition, velocity }])

    engine.step(250)

    expect(engine.getObjectList()).toEqual([])
  })
})
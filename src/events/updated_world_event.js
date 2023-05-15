const { EventFactory, Types } = require('@ellementul/uee-core')
const positionType = Types.Number.Def(4*1024, - 4*1024, 3)
const bodyType = Types.Object.Def({
  uuid: Types.UUID.Def(),
  position: {
    x: positionType,
    y: positionType
  },
  velocity: {
    x: positionType,
    y: positionType
  }
})
const type = Types.Object.Def({
  system: "World",
  entity: "Bodies",
  action: "Updated",
  delta: Types.Index.Def(60 * 1000),
  state: Types.Array.Def(bodyType, 1024, true)
}, true) 
module.exports = EventFactory(type)
const { EventFactory, Types } = require('@ellementul/uee-core')
const positionType = Types.Number.Def(4*1024, - 4*1024, 2)
const sizeType = Types.Number.Def(1024, -1024, 2)
const bodyType = Types.Object.Def({
  uuid: Types.UUID.Def(),
  x: positionType,
  y: positionType,
  dynamic: Types.Bool.Def(),
  shape: {
    type: "Box",
    w: sizeType,
    h: sizeType
  }
})
const type = Types.Object.Def({
  system: "World",
  entity: "Body",
  action: "Created",
  state: bodyType,
}, true) 
module.exports = EventFactory(type)
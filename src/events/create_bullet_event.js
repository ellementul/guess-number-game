const { EventFactory, Types } = require('@ellementul/uee-core')
const positionType = Types.Number.Def(4*1024, - 4*1024, 2)
const type = Types.Object.Def({
  system: "World",
  entity: "Bullet",
  action: "Create",
  uuid: Types.UUID.Def(),
  position: {
    x: positionType,
    y: positionType
  },
  radius: Types.Index.Def(512)
})
module.exports = EventFactory(type)
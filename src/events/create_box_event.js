const { EventFactory, Types } = require('@ellementul/uee-core')
const tilePositionType = Types.Index.Def(4*1024)
const type = Types.Object.Def({
  system: "World",
  entity: "Box",
  action: "Create",
  uuid: Types.UUID.Def(),
  position: {
    column: tilePositionType,
    row: tilePositionType
  }
})
module.exports = EventFactory(type)
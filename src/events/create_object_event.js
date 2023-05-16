const { EventFactory, Types } = require('@ellementul/uee-core')
const positionType = Types.Number.Def(4*1024, - 4*1024, 2)
const type = Types.Object.Def({
  system: "World",
  entity: Types.Any.Def([
    Types.Const.Def("Bullet"),
    Types.Const.Def("Box")
  ]),
  action: "Created",
  state: {
    uuid: Types.UUID.Def(),
    position: {
      x: positionType,
      y: positionType
    },
    radius: positionType
  }
}, true) 
module.exports = EventFactory(type)
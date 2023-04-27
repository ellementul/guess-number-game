const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "GameSession",
  entity: "Answer",
  state: Types.Index.Def(100),
  uuid: Types.UUID.Def()
}, true) 
module.exports = EventFactory(type)
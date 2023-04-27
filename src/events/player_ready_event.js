const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "GameSession",
  entity: "Player",
  state: "Ready",
  uuid: Types.UUID.Def()
})
module.exports = EventFactory(type)
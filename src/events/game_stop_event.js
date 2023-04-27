const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "GameSession",
  entity: "Game",
  state: "Pause"
}, true)
module.exports = EventFactory(type)
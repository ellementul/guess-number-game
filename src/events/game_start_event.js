const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "GameSession",
  entity: "Game",
  state: "Playing"
}, true) 
module.exports = EventFactory(type)
const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "Timing",
  entity: "GameTick"
}, true)
module.exports = EventFactory(type)
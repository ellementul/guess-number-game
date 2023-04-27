const { Provider, Types } = require('@ellementul/uee-core')
const { Player } = require('./index')

jest.mock('console-questions', () => {
  return {
    ask: (quest, { callback }) => callback('')
  };
});

describe('Player', () => {

  test('constructor', () => {
    const player = new Player
    expect(player).toBeDefined();
  });

  test('ready event', () => {

    // Member connect to test provider
    const provider = new Provider
    const player = new Player
    player.setProvider(provider)

    // Subscribe to testing event
    const readyEvent = require('../events/player_ready_event')
    const readyEventCallback = jest.fn()
    provider.onEvent(readyEvent, readyEventCallback)

    // Run the event to has to run the testing event
    const waitEvent = require('../events/wait_event')
    provider.sendEvent(waitEvent.create())

    // Check calling of the testing event
    expect(readyEventCallback).toHaveBeenCalled();
  });

  test('answer event', () => {

    // Member connect to test provider
    const provider = new Provider
    const player = new Player
    player.setProvider(provider)
    console.log = jest.fn()

    // Subscribe to testing event
    const answerEvent = require('../events/player_answer_event')
    const answerEventCallback = jest.fn()
    provider.onEvent(answerEvent, answerEventCallback)

    // Run the event to has to run the testing event
    const askEvent = require('../events/game_ask_event')
    provider.sendEvent(askEvent.create())

    // Check calling of the testing event
    expect(answerEventCallback).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalled();
  });
});
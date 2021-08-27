const Game = require("./game/game")
const { v4: uuidv4 } = require('uuid')
const assert = require('assert')

let eventBus = []
let game = new Game({});
game.registerEventHandler({
    methodRegexp: /^addPlayer$/,
    handler: (event) => eventBus.push(event)
})

game.addPlayer({
    playerId: uuidv4(),
    name: "P1",
})
game.addPlayer({
    playerId: uuidv4(),
    name: "P2",
})

assert.equal(Object.keys(game.players).length, 2)
let pid = []
for (const playerId in game.players) {
    assert.equal(game.players[playerId].unit.pos.x, 50)
    assert.equal(game.players[playerId].unit.pos.y, 50)
    pid.push(playerId)
}

assert.equal(eventBus.length, 2)
assert.deepEqual(eventBus[0], {
    type: "addPlayer",
    args: {
        playerId: pid[0],
        name: "P1"
    }
})
assert.deepEqual(eventBus[1], {
    type: "addPlayer",
    args: {
        playerId: pid[1],
        name: "P2"
    }
})

game.playerMove({ playerId: pid[0], dir: { x: 1, y: 1 } })

game.registerEventHandler({
    methodRegexp: /^playerMove$/,
    handler: (event) => eventBus.push(event)
})

game.playerMove({ playerId: pid[1], dir: { x: 0, y: 1 } })

assert.deepEqual(game.players[pid[0]].unit.pos, { x: 50 + Math.sqrt(2) / 2, y: 50 + Math.sqrt(2) / 2 })
assert.equal(eventBus.length, 3)
assert.deepEqual(eventBus[2], {
    type: "playerMove",
    args: {
        playerId: pid[1], dir: { x: 0, y: 1 }
    }
})


console.log("\nALL TESTS PASS!\n")

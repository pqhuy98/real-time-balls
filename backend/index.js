const { performance } = require('perf_hooks');
const Game = require("shared/src/game/game")

const game = new Game({ id: "global_game" })

game.addPlayer({
    playerId: "neutral",
    name: "NPC",
    unitCount: 10,
})

const FPS = 30
let lastTime = performance.now()
setInterval(() => {
    let now = performance.now()
    let deltaT = (now - lastTime) / 1000 // in seconds
    lastTime = now
    game.serverTick(deltaT)
}, 1000 / FPS)

const app = require("express")()
const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*',
    }
})

game.registerEventHandler({
    methodRegexp: /^.*$/,
    handler: (event) => {
        io.to(game.id).emit("game_event", event)
    }
})

io.on("connection", (socket) => {
    socket.join(game.id)

    socket.on("addPlayer", (data) => {
        console.log("addPlayer", data)

        let { id: playerId, name } = data
        socket.playerId = playerId

        let state = game.getData()
        socket.emit("latest_state", state)

        game.addPlayer({ playerId, name })
        game.playerConnect({ playerId })
    })

    socket.on("player_action", (action) => {
        console.log("player_action", action)

        action.args.playerId = socket.playerId
        game[action.type](action.args)
    })

    socket.on('disconnect', () => {
        console.log("disconnect", socket.playerId)

        let { playerId } = socket
        game.playerDisconnect({ playerId })
    })
})

httpServer.listen(8080)
// WARNING !!! app.listen(8080); will not work here, as it creates a new HTTP server

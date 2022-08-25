import { io } from "socket.io-client"
import Game from "shared/src/game/game"
import { BASE_URL } from "../config"

export default class SocketManager {
    constructor({ gameRef, player, playerName, setGameStep }) {
        const socket = io(BASE_URL)
        this.socket = socket

        socket.on("connect", () => {
            // console.log("register", player)
            socket.emit("addPlayer", player)
        })

        socket.on("latest_state", (state) => {
            // console.log("latest_state", state)

            gameRef.current = new Game({})
            Object.assign(gameRef.current, state)
            setGameStep(gameRef.current.step)
        })

        socket.on("game_event", (event) => {
            console.log("game_event", JSON.stringify(event, 0, 2))
            // console.log("game_event:state", JSON.stringify(gameRef.current, 0, 2))

            if (!gameRef.current) {
                gameRef.current = new Game({})
            }
            gameRef.current.applyEvent(event)
            setGameStep(gameRef.current.step)

            // console.log("game_event:state_next", JSON.stringify(gameRef.current, 0, 2))
            // console.log(gameRef.current)
        })
    }

    sendAction(action) {
        this.socket.emit("player_action", action)
    }

    disconnect() {
        this.socket.disconnect()
    }
}
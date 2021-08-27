import { useEffect, useRef, useState } from "react"
import SocketManager from "../lib/socket_manager"
import { v4 as uuidv4 } from 'uuid'

export default function World() {
    const [player, setPlayer] = useState({})
    const [socketManager, setSocketManager] = useState()
    const gameRef = useRef()
    const [gameStep, setGameStep] = useState()

    useEffect(() => {
        setPlayer({
            id: uuidv4(),
            name: prompt("What is your name?"),
        })
    }, [])

    useEffect(() => {
        if (player.id && player.name?.length > 0) {
            let sm = new SocketManager({ gameRef, player, setGameStep })
            setSocketManager(sm)
            return () => sm.disconnect()
        }
    }, [player])

    const playerMove = ({ dir }) => {
        socketManager.sendAction({
            type: "playerMove",
            args: { dir },
        })
    }

    return <>
        <h1>
            {player.id + "/" + player.name + " : " + gameStep}
        </h1>
        <button onClick={() => playerMove({ dir: { x: 0, y: -1 } })}>Up</button>
        <pre>{JSON.stringify(gameRef.current, null, 2)}</pre>
    </>
}
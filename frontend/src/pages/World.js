import { useEffect, useRef, useState } from "react"
import SocketManager from "../lib/socket_manager"
import { v4 as uuidv4 } from 'uuid'
import { Board } from "../components/Board"

export default function World() {
    const [player, setPlayer] = useState({})
    const [socketManager, setSocketManager] = useState()
    const gameRef = useRef()
    const [gameStep, setGameStep] = useState()

    useEffect(() => {
        let name = uuidv4().slice(-4)
        setPlayer({
            id: uuidv4(),
            name,
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

    return (
        <div style={styles.container}>
            {/* <h1>{player.id + " -- " + player.name}</h1>
            <h2>{"Step: " + gameStep}</h2> */}
            <Board game={gameRef.current} playerId={player.id} />
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
    }
}


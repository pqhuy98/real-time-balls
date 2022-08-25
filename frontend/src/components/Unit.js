export function Unit({ unit, isMine }) {
    return <div style={{
        ...styles,
        left: unit.pos.x + "%",
        top: unit.pos.y + "%",
        backgroundColor: (isMine ? "red" : "white"),
    }} />
}

const styles = {
    position: "absolute",
    width: "2%",
    height: "2%",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
}
export default function CharacterInput({ x, y, markerSize, addCharacter }){
    const style = {
        left: `${x + markerSize / 2}px`,
        top: `${y - markerSize / 2}px`,
        position: "absolute",
        boxSizing: 'border-box',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
    }
    return (
        <form onSubmit={addCharacter} style={style}>
            <input autoFocus type="text" name="character" required />
            <button type="submit">Submit</button>
        </form>
    )
}
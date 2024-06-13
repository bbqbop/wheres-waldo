export default function CharacterInput({ x, y, imgOffset, markerSize, addCharacter }){
    const style = {
        left: `${x + imgOffset[0] + markerSize / 2}px`,
        top: `${y + imgOffset[1] - markerSize / 2}px`,
        position: "absolute",
        boxSizing: 'border-box',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
    }
    return (
        <form onSubmit={addCharacter} style={style}>
            <input type="text" name="character" required />
            <button type="submit">Submit</button>
        </form>
    )
}
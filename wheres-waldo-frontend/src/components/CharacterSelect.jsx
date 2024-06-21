export default function CharacterSelect({ x, y, markerSize, characters, onSelect }){
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
        <div className="select" style={style}>
                {characters.map((character, idx) => (
                    !character.found && (
                        <button key={idx} id={idx} onClick={onSelect}>{character.name}</button>
                    )
                ))}
        </div>

    )
}
import Marker from "./Marker"

export default function CharacterSelect({ x, y, offset, characters, onSelect }){
    const style = {
        left: `${x + offset[0]}px`,
        top: `${y + offset[1]}px`,
        position: "absolute",
        boxSizing: 'border-box',
        zIndex: 1000,
    }
    return (
        <div className="select" style={style}>
                {characters.map((character, idx) => (
                    !character.found && (
                        <button key={idx}>{character.name}</button>
                    )
                ))}

            {/* <select name="character" id="character" onChange={onSelect}>
                {characters.map((character, idx) => (
                    <option key={idx} id={idx}>{character.name}</option>
                ))}
            </select> */}
        </div>

    )
}
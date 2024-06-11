import { useEffect, useState } from "react"
import styles from "./Game.module.css"
import CharacterSelect from "./CharacterSelect";
import Marker from "./Marker";
import GameOver from "./GameOver";
import CharacterInput from "./CharacterInput";
import useSendData from "../hooks/useSendData";
import { useNavigate } from "react-router-dom";

export default function Game({ data, mode = 'play' }){
    console.log(data)
    const { loading, error, sendData } = useSendData()
    const navigate = useNavigate();

    const [clientX, setClientX] = useState(false);
    const [clientY, setClientY] = useState(false);
    const [imgOffset, setImgOffset] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [marker, setMarker] = useState([]);
    const [markerSize, setMarkSize] = useState(50)

    const [title, setTitle] = useState(false)
    const [img, setImg] = useState(null)
    const [characters, setCharacters] = useState([]);

    const [gameOver, setGameOver] = useState(false)

    const setCoords = (e) => { 
        const rect = e.target.getBoundingClientRect();
        const x = e.pageX;
        const y = e.pageY;

        setClientX(x);
        setClientY(y);
        setIsClicked(true);
    }

    const compareCoords = ([x,y],[x2,y2]) => {
        if (x >= x2 - markerSize / 2 - imgOffset[0] && 
            x <= x2 + markerSize / 2 - imgOffset[0] && 
            y >= y2 - markerSize / 2 - imgOffset[1] && 
            y <= y2 + markerSize / 2 - imgOffset[1] ){
            return true
        } else return false
    }

    function handleSelect(e){
        const character = characters[e.target.id]
        const result = compareCoords(character.coords, [clientX, clientY])
        if (result){
            character.found = true
            setMarker(prev => [...prev, [clientX, clientY, "green"]])
            setCharacters(prev => [...prev], character)
        } else {
            setMarker(prev => [...prev, [clientX, clientY, "red"]])
        }
        setIsClicked(false)
    }

    const handleSubmit = async() => {
        const result = await sendData(`/game/${data._id}`, characters, "PUT")
        if(result) navigate("/");
    }

    function handleAddCharacter(e){
        e.preventDefault();
        const newCharacter = {
            name: e.target.character.value,
            coords: [clientX - imgOffset[0], clientY - imgOffset[1]]
        }
        setCharacters(prev => [...prev, newCharacter])
        setIsClicked(false)
        setMarker(prev => [...prev, [clientX, clientY, 'green']])
    }

    useEffect(() => {
        setImg(data.image.url)
        setTitle(data.title)
        if(mode == 'play'){
            setCharacters(data.characters.map(character => ({ ...character, found: false })))
        }
    },[data])

    useEffect(() => {
        if(!img) return

        const image = document.getElementById("img");
        if(!image) return
        image.addEventListener('load', handleLoad)

       function handleLoad(){
            const rect = image.getBoundingClientRect();
            setImgOffset([rect.left,rect.top])
            image.addEventListener('click', setCoords)
        }
        return(()=>{
            image.removeEventListener('click', setCoords)
            image.removeEventListener('load', handleLoad)
        })
    }, [img]);

    useEffect(() => {
        if(mode != 'play') return
        if(!characters) return
        const result = characters.filter(character => !character.found)

        if(result.length <= 0){
            setGameOver(true);
        }
    },[characters])

    if(gameOver){
        return(
            <GameOver />    
        )
    }

    return(
        <div className={styles.game}>
            <h1>{title}</h1>
            {loading && <p>'...loading'</p>}
            {error && <p>{error.message}</p>}
            {mode == "setup" && 
                <>
                    <h3>Mark characters!</h3>
                    {characters.length >= 1 && <button onClick={handleSubmit}>Submit</button>}    
                </>
            }
            <img src={img} id="img" />
            {isClicked && (
            <>
                <Marker x={clientX} y={clientY} markerSize={markerSize} />
                {mode == "play" ? <CharacterSelect x={clientX} y={clientY} markerSize={markerSize} characters={characters} onSelect={handleSelect}/>
                                : <CharacterInput x={clientX} y={clientY} markerSize={markerSize} addCharacter={handleAddCharacter}/>}
            </>
            )}
            {marker.map((marker, idx) => <Marker x={marker[0]} y={marker[1]} offset={imgOffset} key={idx} color={marker[2]} markerSize={markerSize} />)}
        </div>
    )
}
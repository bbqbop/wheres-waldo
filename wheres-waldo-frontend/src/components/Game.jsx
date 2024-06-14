import { useEffect, useState } from "react"
import styles from "./Game.module.css"
import CharacterSelect from "./CharacterSelect";
import Marker from "./Marker";
import GameOver from "./GameOver";
import CharacterInput from "./CharacterInput";
import useSendData from "../hooks/useSendData";
import { useNavigate } from "react-router-dom";

export default function Game({ data, mode = 'play' }){
    const { loading, error, sendData } = useSendData()
    const navigate = useNavigate();

    const [clientX, setClientX] = useState(false);
    const [clientY, setClientY] = useState(false);
    const [imgOffset, setImgOffset] = useState([0, 0]);
    const [isClicked, setIsClicked] = useState(false);
    const [marker, setMarker] = useState([]);
    const [markerSize, setMarkSize] = useState(50)

    const [title, setTitle] = useState(false)
    const [img, setImg] = useState(null)
    const [characters, setCharacters] = useState([]);

    const [timer, setTimer] = useState(0)
    const [gameOver, setGameOver] = useState(false)

    const setCoords = (e) => { 
        const x = e.offsetX;
        const y = e.offsetY;

        setClientX(x);
        setClientY(y);
        setIsClicked(true);
    }

    const compareCoords = ([x,y],[x2,y2]) => {
        if (x >= x2 - markerSize / 2 && 
            x <= x2 + markerSize / 2 && 
            y >= y2 - markerSize / 2 && 
            y <= y2 + markerSize / 2 ){
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
            coords: [clientX, clientY]
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
    },[data, mode])

    useEffect(() => {
        if(!img) return

        const image = document.getElementById("img");
        if(!image) return
        image.addEventListener('load', handleLoad)

       function handleLoad(){
            const rect = image.getBoundingClientRect();
            setImgOffset([window.scrollX + rect.left, window.scrollY + rect.top]);
            image.addEventListener('click', setCoords)
        }
        return(()=>{
            image.removeEventListener('click', setCoords)
            image.removeEventListener('load', handleLoad)
        })
    }, [img]);

    useEffect(() => {
        if(mode != 'play' || !characters.length) return

        const allCharactersHaveFoundProperty = characters.every(character => character.hasOwnProperty('found'));
        if(!allCharactersHaveFoundProperty) return

        const result = characters.filter(character => !character.found)

        if(result.length <= 0){
            setGameOver(true);
        }
    },[characters, mode])

    useEffect(() => {
        if (mode != 'play') return

        const incrementTimer = () => {
            setTimer(prev => prev + 1)
        }

        const interval = setInterval(incrementTimer,1000)

        if (gameOver) clearInterval(interval)
        return (() => clearInterval(interval))

    },[mode, gameOver])

    useEffect(() => {
        const image = document.getElementById("img");
        const rect = image.getBoundingClientRect();
        setImgOffset([window.scrollX + rect.left, window.scrollY + rect.top]);
    },[isClicked])

    if(gameOver){
        return(
            <GameOver time={timer}/>    
        )
    }

    return(
        <div className={styles.game}>
            <h1>{title}</h1>
            <p>{timer}</p>
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
                <Marker x={clientX} y={clientY} markerSize={markerSize} imgOffset={imgOffset} />
                {mode == "play" ? <CharacterSelect x={clientX} y={clientY} imgOffset={imgOffset} markerSize={markerSize} characters={characters} onSelect={handleSelect}/>
                                : <CharacterInput x={clientX} y={clientY}imgOffset={imgOffset} markerSize={markerSize} addCharacter={handleAddCharacter}/>}
            </>
            )}
            {marker.map((marker, idx) => <Marker x={marker[0]} y={marker[1]} imgOffset={imgOffset} key={idx} color={marker[2]} markerSize={markerSize} />)}
        </div>
    )
}
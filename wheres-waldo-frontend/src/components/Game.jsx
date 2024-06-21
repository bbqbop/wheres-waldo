import { useEffect, useRef, useState } from "react"
import styles from "./Game.module.css"
import CharacterSelect from "./CharacterSelect";
import Marker from "./Marker";
import GameOver from "./GameOver";
import CharacterInput from "./CharacterInput";
import useSendData from "../hooks/useData";
import { useNavigate } from "react-router-dom";

export default function Game({ data, mode = 'play' }){
    const { loading, error, sendData } = useSendData()
    const navigate = useNavigate();

    const [clientX, setClientX] = useState(false);
    const [clientY, setClientY] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [marker, setMarker] = useState([]);

    const [title, setTitle] = useState(false)
    const [img, setImg] = useState(null)
    const [characters, setCharacters] = useState([]);
    const [scores, setScores] = useState(false)

    const [timer, setTimer] = useState(0)
    const startTimeRef = useRef(null);
    const [gameOver, setGameOver] = useState(false)

    const markerSize = 50

    const reset = (e, updatedScores) => {
        setTimer(0)
        setGameOver(false)
        setMarker([])
        setIsClicked(false)
        setScores(updatedScores)
    }

    const setCoords = (e) => { 
        const x = e.layerX;
        const y = e.layerY;

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

    function handleDeleteCharacter(idx){
        console.log(idx)
        setCharacters((prev) => {
            const newArray = [...prev];
            newArray.splice(idx, 1)
            return newArray
        })
        setMarker((prev) => {
            const newArray = [...prev];
            newArray.splice(idx, 1)
            return newArray
        })
    }

    useEffect(() => {
        setImg(data.image.url)
        setTitle(data.title)
        if(mode == 'play'){
            setCharacters(data.characters.map(character => ({ ...character, found: false })))
        }
    },[data, mode, gameOver])

    useEffect(() => {
        if(!img) return

        const image = document.getElementById("img");
        if(!image) return
        image.addEventListener('load', handleLoad)

       function handleLoad(){
            image.addEventListener('click', setCoords)
        }
        return(()=>{
            image.removeEventListener('click', setCoords)
        })
    }, [img, gameOver]);

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

        if (!startTimeRef.current) {
            startTimeRef.current = Date.now()
        }

        const incrementTimer = () => {
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000
            setTimer(elapsedTime.toFixed(1));
        }

        const interval = setInterval(incrementTimer, 100);

        if (gameOver) {
            clearInterval(interval);
            startTimeRef.current = null;
        }

        return () => clearInterval(interval);

    },[mode, gameOver])

    if(gameOver){
        return(
            <GameOver time={timer} gameId = {data._id} gameScores = {scores || data.scores} reset={reset} />    
        )
    }

    return(
        <div className={styles.body}>
            <div className={styles.title}>
                <h1>{title}</h1>
                {mode == 'play' && <p>{timer}</p>}
                {loading && <p>'...loading'</p>}
                {error && <p>{error.message}</p>}
                {mode == "setup" && 
                    <div className={styles.setup}>
                        <div>
                            <h3>Mark characters!</h3>
                            {characters.length >= 1 && <button onClick={handleSubmit}>Submit</button>}  
                        </div>
                        {characters.map((character, idx) => (
                            <div key={idx} className={styles.characters}>
                                <p>{character.name}</p>
                                <button onClick={() => handleDeleteCharacter(idx)}>Delete</button>
                            </div>
                        ))}  
                    </div>
                }
            </div>
            <div className={styles.game}>
                <img src={img} id="img" />
                {isClicked && (
                <>
                    <Marker x={clientX} y={clientY} markerSize={markerSize} />
                    {mode == "play" ? <CharacterSelect x={clientX} y={clientY} markerSize={markerSize} characters={characters} onSelect={handleSelect}/>
                                    : <CharacterInput x={clientX} y={clientY} markerSize={markerSize}  addCharacter={handleAddCharacter}/>}
                </>
                )}
                {marker.map((marker, idx) => <Marker x={marker[0]} y={marker[1]} markerSize={markerSize} key={idx} color={marker[2]} />)}
            </div>
        </div>
    )
}
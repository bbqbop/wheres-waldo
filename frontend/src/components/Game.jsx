import { useEffect, useState } from "react"
import styles from "./Game.module.css"
import CharacterSelect from "./CharacterSelect";
import Marker from "./Marker";
import GameOver from "./GameOver";

export default function Game(){
    const [clientX, setClientX] = useState(false);
    const [clientY, setClientY] = useState(false);
    const [imgOffset, setImgOffset] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [marker, setMarker] = useState([]);
    const [markerSize, setMarkSize] = useState(50)

    const [title, setTitle] = useState(false)
    const [img, setImg] = useState('')
    const [characters, setCharacters] = useState(false);

    const [gameOver, setGameOver] = useState(false)

    const setCoords = (e) => { 
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
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

    useEffect(() => {
         const fetchGame = async () => {
            try {
                const res = fetch("../../sample.json");
                // if (!res.ok) {
                //     throw new Error('Network response was not ok')
                // }
                const data = await (await res).json();
                setTitle(data.title)
                setImg(data.img)
                setCharacters(data.characters.map(character => ({ ...character, found: false })));
            } catch (error) {
                console.error('Failed to fetch JSON file', error)
            }
         }

         fetchGame()
    },[])

    useEffect(() => {
        const image = document.getElementById("img");

        const handleImageLoad = () => {
            const rect = image.getBoundingClientRect();
            setImgOffset([rect.left, rect.top]);
        };

        if (image.complete) {
            handleImageLoad();
        } else {
            image.addEventListener('load', handleImageLoad);
        }

        window.addEventListener('resize', handleImageLoad);
        image.addEventListener("click", setCoords);

        return () => {
            image.removeEventListener('click', setCoords);
            image.removeEventListener('load', handleImageLoad);
            window.removeEventListener('resize', handleImageLoad);
        };
    }, []);

    useEffect(() => {
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
            <h2>{title}</h2>
            <img src={img} id="img" />
            {isClicked && (
            <>
                <Marker x={clientX} y={clientY} offset={imgOffset} markerSize={markerSize} />
                <CharacterSelect x={clientX} y={clientY} offset={imgOffset} markerSize={markerSize} characters={characters} onSelect={handleSelect}/>
            </>
            )}
            {marker.map((marker, idx) => <Marker x={marker[0]} y={marker[1]} offset={imgOffset} key={idx} color={marker[2]} markerSize={markerSize} />)}
        </div>
    )
}
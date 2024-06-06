import { useEffect, useState } from "react"
import styles from "./Game.module.css"
import CharacterSelect from "./CharacterSelect";
import Marker from "./Marker";

export default function Game(){
    const [clientX, setClientX] = useState(false);
    const [clientY, setClientY] = useState(false);
    const [imgOffset, setImgOffset] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [marker, setMarker] = useState([]);

    const [title, setTitle] = useState(false)
    const [img, setImg] = useState('')
    const [characters, setCharacters] = useState(false);

    const setCoords = (e) => { 
        const rect = e.target.getBoundingClientRect();
        console.log(rect.top)
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log(x, y);
        setClientX(x);
        setClientY(y);
        setIsClicked(true);
    }

    function handleSelect(e){
        const characterIndex = e.target.selectedIndex
        setMarker(prev => [...prev, [clientX, clientY]])
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

        console.log(image)

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

    return(
        <div className={styles.game}>
            <h2>{title}</h2>
            <img src={img} id="img" />
            {isClicked && (
            <>
                <Marker x={clientX} y={clientY} offset={imgOffset} />
                <CharacterSelect x={clientX} y={clientY} offset={imgOffset} characters={characters} onSelect={handleSelect}/>
            </>
            )}
            {marker.map((coords, idx) => <Marker x={coords[0]} y={coords[1]} offset={imgOffset} key={idx} color="green"/>)}
        </div>
    )
}
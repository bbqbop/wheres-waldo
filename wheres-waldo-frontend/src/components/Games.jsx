import moment from "moment";
import styles from "./Games.module.css"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useData from "../hooks/useData"
import { useAuth } from "../contexts/authContext";
import { render } from "react-dom";

export default function Games(){
    const { loading, error, data, getData, sendData } = useData()
    const { isLoggedIn } = useAuth();
    const [ isAdmin, setIsAdmin ] = useState(false);
    
    useEffect(() => {
        getData("/games");
    },[])

    useEffect(() => {
        if(isLoggedIn){
            const user = JSON.parse(localStorage.user)
            setIsAdmin(user.isAdmin)
        }
    },[isLoggedIn])

    const deleteEntry = async (id) => {
        const success = await sendData(`/game/${id}`, false, 'DELETE');
        if(success) await getData("/games");
    }

    const findTopThreeScores = (scores) => {
        const newArray = [...scores];
        newArray.sort((a,b) => a.score - b.score)
        return newArray.slice(0, 3)
    }

    return (
        <div className={styles.games}>
            {   
                data && data.games.length == 0 ? (
                    <h2>No games yet</h2>
                ) : 
                data && data.games.length >= 1 && data.games.map((game, idx) => (
                    <div className={styles.game} key={idx}>
                        {isAdmin && <button onClick={(e) => {
                            e.stopPropagation()
                            deleteEntry(game._id)

                            }}>Delete</button>}
                        <Link to={`/game/${game._id}`} id={game.title} key={game._id}>
                            <div>
                                <div>
                                    <h3>{game.title}</h3>
                                    {game.author && <h5>by {game.author.username} / {moment(game.date).format('MMM Do, YYYY')}</h5>}
                                    <img src={ game.image.preview && game.image.preview.url || game.image.url } style={{ width: 'auto', height: '120px', borderRadius: '5px' }} alt="" />
                                </div>
                            </div>
                            <div className={styles.scoreboard}>
                                <ol>
                                    {game.scores.length >= 1 ? <b>TOP 3</b> : <b>No scores yet</b>}
                                    {findTopThreeScores(game.scores).map((score, index) => (
                                        <li key={index}>{score.username}: {score.score}</li>
                                    ))}
                                </ol>
                            </div>
                        </Link>
                    </div>
                ))
            }
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>} 
        </div>
    )
}
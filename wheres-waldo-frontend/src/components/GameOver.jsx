import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import useSendData from "../hooks/useData";
import ScoreForm from "./ScoreForm";

export default function GameOver({ time, gameId, gameScores, reset }) {
    const { isLoggedIn, user } = useAuth();
    const { sendData, loading, error, data } = useSendData();
    const [localError, setLocalError] = useState('');
    const [username, setUsername] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [scores, setScores] = useState([]);
    const [isHighScore, setIsHighScore] = useState(false);
    const [scorePos, setScorePos] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsClicked(true);
        const success = await sendData(`/game/${gameId}/scores`, { username, score: time }, 'PUT');
        if (success) {
            setLocalError(success.message);
            setScores(prev => {
                const newArray = [...prev]
                newArray[scorePos].username = username
                return newArray
            })
        } else {
            setIsClicked(false);
        }
    };

    useEffect(() => {
        setLocalError('');
        if (isLoggedIn) {
            setUsername(user.username);
        }
    }, [isLoggedIn, user]);

    useEffect(() => {
        const newArray = [...gameScores]
        newArray.push({score: time, username: 'userScore'})
        newArray.sort((a, b) => a.score - b.score)
        setScores(newArray);

        newArray.find((entry, idx) => {
            if(entry.username == 'userScore') setScorePos(idx)
        })

        if (newArray[0].username == 'userScore'){
            setIsHighScore(true)
        } 

    }, [gameScores, time]);

    return (
        <div className="gameOver">
            {isHighScore && <h2>NEW HIGHSCORE!</h2>}
            You've found all the characters in {time} seconds

            <ol style={{ listStyle: 'decimal', paddingLeft: "20px" }}>
                {scores.map((score, idx) => (
                    <li key={idx}>
                        {score.username == "userScore"
                        ? <ScoreForm handleSubmit={handleSubmit} username={username} setUsername={setUsername} isClicked={isClicked}/>
                        : `${score.username} : ${score.score}`
                        }
                    </li>
                ))}
            </ol>

            <hr />            
            <a onClick={(e) => reset(e, scores)}>Play-again </a>

            {loading && <p>'...loading'</p>}
            {error && <p>{error.message}</p>}
            {localError && <p>{localError}</p>}
        </div>
    );
}

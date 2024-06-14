export default function GameOver({ time }){
    return(
        <div className="gameOver">
            You've found all the characters in { time } seconds
            <a href="/">Home</a>
        </div>
    )
}
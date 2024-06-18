export default function ScoreForm({ handleSubmit, username, setUsername, isClicked }){
    return (
        <form onSubmit={handleSubmit}>
            <input name="username" id="username" value={username} placeholder="Enter username" onChange={e => setUsername(e.target.value)}/>
            <button type="submit" id="submit" disabled={isClicked} >Submit score</button>
        </form>
    )
}
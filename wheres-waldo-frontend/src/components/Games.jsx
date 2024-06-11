import { useEffect } from "react"
import { Link } from "react-router-dom"
import useGetData from "../hooks/useGetData"

export default function Games(){
    const { loading, error, data, getData } = useGetData()
    
    useEffect(() => {
        getData("/games")
    },[])

    return (
        <>
            {loading ? <h2>...loading</h2> 
            : error ? <h2>{error.message}</h2> :
            ! data 
                ? 
                    <h2>No Games Yet</h2>
                : 
                    data.games.map(game => (
                        <div id={game.title} key={game._id}>
                            <Link to={`/game/${game._id}`}>
                                <h4>{game.title}</h4>
                                <img src={game.image.url} style={{width:"200px", height:"auto"}} alt="" />
                            </Link>
                        </div>
                ))
            }
            
        </>
    ) 
}
import { useParams } from "react-router-dom"
import useGetData from "../hooks/useGetData"
import { useEffect } from "react"
import Game from "./Game"

export default function LoadingScreen(){
    const { loading, error, data, getData } = useGetData()

    const { id } = useParams()

    useEffect(() => {
        getData(`/game/${id}`)
    }, [])

    return (
        <>  
            {loading && <p>...loading</p>}
            {error && <p>{error.message}</p>}
            {data && <Game data={data.game} mode="play" /> }
        </>
    )
}
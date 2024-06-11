import Game from "./components/Game"
import styles from "./App.module.css"
import { Link } from "react-router-dom"
import useGetData from "./hooks/useGetData"
import { useEffect } from "react";

export default function App(){

  const { loading, error, data, getData } = useGetData();

  useEffect(() => {
    getData("/")
  },[])

  return(
    <div className={styles.app}>
      <h1>Where's Waldo</h1>
      <Link to="/game/1">Play</Link>
      <Link to="/create-game">Create Game</Link>
      {data && console.log(data)}
    </div>
  )
}
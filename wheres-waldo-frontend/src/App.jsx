import Game from "./components/Game"
import styles from "./App.module.css"
import { Link } from "react-router-dom"
import { useAuth } from "./contexts/authContext"

export default function App(){

  const { isLoggedIn, user, logout } = useAuth()

  return(
    <div className={styles.app}>
      <h1>Where's Waldo</h1>
      <Link to="/games">Play </Link>
      <Link to="/create-game">Create-Game </Link>
      { isLoggedIn 
        ? <Link to="/" onClick={logout}>Logout </Link>
        : <Link to="/login">Login </Link>
      }
    </div>
  )
}
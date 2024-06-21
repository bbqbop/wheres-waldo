import { Link } from "react-router-dom"
import { useAuth } from "../contexts/authContext"
import styles from "./HomeScreen.module.css"

export default function HomeScreen(){
    const { isLoggedIn, user, logout } = useAuth()

    return (
      <div >
        <h2 className={styles.body}>
        <Link to="/games">Play </Link>
        <Link to="/create-game">Create-Game </Link>
        { isLoggedIn 
          ? <Link to="/" onClick={logout}>Logout </Link>
          : <Link to="/login">Login </Link>
        }
        </h2>
      </div>
    )
}
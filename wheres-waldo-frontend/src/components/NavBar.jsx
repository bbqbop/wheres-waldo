import styles from "./NavBar.module.css"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/authContext"

export default function NavBar(){

    const { isLoggedIn, user } = useAuth()
    const navigate = useNavigate()

    return (
        <div className={styles.navbar}>
            <Link to="/">
                <img src="/waldo.svg" alt="Icon by Stefan Spieler from the Noun Project " style={{height: '100px', display:"inline-block"}}/>
                <h2>Where's Waldo</h2>
            </Link>
            {isLoggedIn && <Link className={styles.user} to={`/user/${user.id}`}>Hi {user.firstname}</Link>}
        </div>
    )
}
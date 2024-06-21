import styles from "./App.module.css"
import { Link, Outlet } from "react-router-dom"
import { useAuth } from "./contexts/authContext"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

export default function App(){

  const { isLoggedIn, user, logout } = useAuth()

  return(
    <div className={styles.app}>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}
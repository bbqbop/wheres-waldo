import styles from "./App.module.css"
import { Outlet } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"

export default function App(){

  return(
    <div className={styles.app}>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}
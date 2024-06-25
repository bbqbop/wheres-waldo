import styles from "./App.module.css"
import { Outlet, useRouteError } from "react-router-dom"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import ErrorPage from "./components/ErrorPage"

export default function App(){
  const error = useRouteError()

  return(
    <div className={styles.app}>
      <NavBar />      
      <Outlet />
      {error && <ErrorPage />}
      <Footer />
    </div>
  )
}
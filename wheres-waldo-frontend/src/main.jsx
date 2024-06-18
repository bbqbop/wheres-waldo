import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Game from './components/Game.jsx'
import GameOver from './components/GameOver.jsx'
import CreateGame from './components/CreateGame'
import Games from './components/Games'
import LoadingScreen from './components/LoadingScreen'
import { AuthProvider } from './contexts/authContext'
import SignUp from './components/SignUp'
import Login from './components/Login'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/games",
    element: <Games />
  },
  {
    path: "/game/:id",
    element: <LoadingScreen />,
  },
  {
    path: "/game-over",
    element: <GameOver />,
  },
  {
    path: "/create-game",
    element: <CreateGame />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/sign-up",
    element: <SignUp />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)

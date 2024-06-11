import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import Game from './components/Game.jsx'
import GameOver from './components/GameOver.jsx'
import CreateGame from './components/CreateGame'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/game/:id",
    element: <Game />,
  },
  {
    path: "/game-over",
    element: <GameOver />,
  },
  {
    path: "/create-game",
    element: <CreateGame />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import GameOver from './components/GameOver.jsx'
import CreateGame from './components/CreateGame'
import Games from './components/Games'
import LoadingScreen from './components/LoadingScreen'
import { AuthProvider } from './contexts/authContext'
import SignUp from './components/SignUp'
import Login from './components/Login'
import HomeScreen from './components/HomeScreen'
import UserInfo from './components/UserInfo'
import ErrorPage from './components/ErrorPage'
import ChangePassword from './components/ChangePassword'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomeScreen />},
      {
        path: "games",
        element: <Games />
      },
      {
        path: "game/:id",
        element: <LoadingScreen />,
      },
      {
        path: "game-over",
        element: <GameOver />,
      },
      {
        path: "create-game",
        element: <CreateGame />
      },
      {
        path: "login",
        element: <Login />
      },
      {
        path: "sign-up",
        element: <SignUp />
      },
      {
        path: "user/:id",
        element: <UserInfo />
      }, 
      {
        path: "user/:id/change-password",
        element: <ChangePassword />
      },
      {
        path: "*",
        element: <ErrorPage />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)

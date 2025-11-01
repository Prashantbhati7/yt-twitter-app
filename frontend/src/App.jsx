import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import VideosHome from './pages/videos_folder/VidoesHome.jsx'
import TweetHome from './pages/tweet_folder/tweetHome.jsx'
function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path ='/login' element={<Login />} />
          <Route path='/videos' element={<VideosHome/>}></Route>
          <Route path='/tweets' element={<TweetHome></TweetHome>} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;

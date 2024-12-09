import React from 'react'
import {Link} from 'react-router-dom'
const Home = () => {
  return (
    <div>
      Home
      <button><Link to="/dashboard">Dash Board</Link></button>
      <br/><br/>
      <button>Logout</button>
    </div>
  )
}

export default Home

import React from 'react'
import Board from './Board'
import Sidebar from './Sidebar'
import './App.scss'

function App() {
  return (
    <div className='app d-flex h-100'>
      <Sidebar />
      <Board />
    </div>
  )
}

export default App

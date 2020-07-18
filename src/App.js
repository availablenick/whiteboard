import React, { useState } from 'react'
import Board from './Board'
import Sidebar from './Sidebar'

function App() {
  let initialConfig = {
    pencil: null,
    eraser: { size: 16 },
    filler: null,
    text: null,
    shapes: {
      line: null,
      rectangle: null,
      circle: null
    },

    'eye-dropper': null,
    zoom: null,
    drawing: { color: 'rgba(0, 0, 0, 1)' },
    erasing: { color: 'rgba(255, 255, 255, 1)' },
  }

  let [config, setConfig] = useState(initialConfig)
  let [tool, setTool] = useState('pencil')

  return (
    <div className='app d-flex h-100'>
      <Sidebar config={config} setConfig={setConfig} setTool={setTool} />
      <Board config={config} setConfig={setConfig} tool={tool}
        width='750' height='500'/>
    </div>
  )
}

export default App

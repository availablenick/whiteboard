import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tool from './Tool'
import './Sidebar.scss'

function Sidebar(props) {
  let toolsInfo = [
    { name: 'pencil-alt', value: false },
    { name: 'eraser', value: false },
    { name: 'fill', value: false },
    { name: 'font', value: false },
    { name: 'eye-dropper', value: false },
    { name: 'search', value: false }
  ]

  let initialState = {
    toolsInfo: toolsInfo
  }

  let [state, setState] = useState(initialState)
  let tools = state.toolsInfo.map(item => {
    let style = {}
    if (item.value === true)
      style = {
        background: 'white',
        color: 'black'
      }

    return (
      <li>
        <Tool
          icon={item.name}
          isSelected={item.value}
          setBoardCursor={props.setBoardCursor}
          setSidebarState={setState}
          style={style}
        />
      </li>
    )
  })

  const handleClick = () => {
    props.setBoardCursor('')
    setState(prevState => {
      let newToolsInfo = prevState.toolsInfo.map(item => {
        return { name: item.name, value: false }
      })

      return { toolsInfo: newToolsInfo }
    })
  }

  return (
    <aside className='d-flex flex-column justify-content-between text-white'
      onClick={handleClick}>
      <ul className='p-0 w-100'>
        {tools}
      </ul>

      <span>
        <span><FontAwesomeIcon icon='bars' /></span>
      </span>
    </aside>
  )
}

export default Sidebar

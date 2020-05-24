import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tool from './Tool'
import { tools } from './res/tools'
import './Sidebar.scss'

function Sidebar(props) {
  let toolsInfo = tools.map(item => ({ name: item, value: false }))
  let [state, setState] = useState({ toolsInfo: toolsInfo })
  let toolsList = state.toolsInfo.map(item => {
    let style = {}
    if (item.value === true)
      style = {
        background: 'white',
        color: 'black'
      }

    return (
      <li key={item.name}>
        <Tool
          icon={item.name}
          isSelected={item.value}
          setTool={props.setTool}
          setSidebarState={setState}
          style={style}
        />
      </li>
    )
  })

  const handleClick = () => {
    props.setTool('none')
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
        {toolsList}
      </ul>

      <span>
        <span><FontAwesomeIcon icon='bars' /></span>
      </span>
    </aside>
  )
}

export default Sidebar

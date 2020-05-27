import React, { useState } from 'react'
import Helper from './Helper'
import Tool from './Tool'
import { helpers } from './res/helpers'
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

  let helpersList = helpers.map(item => <li key={item}><Helper icon={item} /></li>)
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
      <ul className='tools-list p-0'>
        {toolsList}
      </ul>

      <ul className='helpers-list p-0'>
        {helpersList}
      </ul>
    </aside>
  )
}

export default Sidebar

import React, { useState, forwardRef } from 'react'
import Color from './color/Color'
import Group from './Group'
import Misc from './Misc'
import Tool from './Tool'
import { misc, icons as miscIcons } from './res/misc'
import { tools, icons as toolsIcons } from './res/tools'
import './Sidebar.scss'

const Sidebar = forwardRef((props, ref) => {
  let initialState = {}
  for (let key in tools) {
    initialState[key] = false
  }

  initialState.pencil = true
  let [state, setState] = useState(initialState)
  let toolsList = Object.keys(state).map(key => {
    if (tools[key] !== null) {
      return (
        <li key={key}>
          <Group
            name={key}
            isSelected={state[key]}
            setTool={props.setTool}
            setSidebarState={setState}
          />
        </li>
      )
    }

    return (
      <li key={key}>
        <Tool
          name={key}
          icon={toolsIcons[key]}
          isSelected={state[key]}
          setTool={props.setTool}
          setSidebarState={setState}
        />
      </li>
    )
  })

  let miscList = misc.map(item => {
    return <li key={item}><Misc name={item} icon={miscIcons[item]}
      config={props.config} setConfig={props.setConfig} 
      setIsSidebarVisible={props.setIsSidebarVisible} /></li>
  })

  return (
    <aside className='d-flex flex-column justify-content-between
      text-white' ref={ref}>
      <ul className='tools-list p-0'>
        {toolsList}
      </ul>

      <ul className='misc-list p-0'>
        <li>
          <Color config={props.config} setConfig={props.setConfig} />
        </li>
        {miscList}
      </ul>
    </aside>
  )
})

export default Sidebar

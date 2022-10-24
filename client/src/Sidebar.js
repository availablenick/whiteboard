import React, { useState, forwardRef } from 'react'
import Color from './color/Color'
import Group from './Group'
import Misc from './Misc'
import Tool from './Tool'
import { makeItem as makeTool } from './res/tools/toolHandler'
import { makeItem as makeMiscItem } from './res/misc/miscHandler'
import './Sidebar.scss'

const Sidebar = forwardRef((props, ref) => {
  const toolArrangement = {
    pencil: null,
    eraser: null,
    bucket: null,
    text: null,
    shapes: [
      'line',
      'rectangle',
      'circle'
    ],
    eyeDropper: null,
  };

  let initialState = {}
  for (let tool in toolArrangement) {
    initialState[tool] = false
  }

  initialState[props.tool] = true
  let [state, setState] = useState(initialState)
  let toolsList = Object.keys(state).map(tool => {
    if (toolArrangement[tool] !== null) {
      return (
        <li key={tool}>
          <Group
            name={tool}
            tools={toolArrangement[tool]}
            isSelected={state[tool]}
            setTool={props.setTool}
            setSidebarState={setState}
          />
        </li>
      )
    }

    return (
      <li key={tool}>
        <Tool
          name={tool}
          icon={makeTool(tool, {}).getIcon()}
          isSelected={state[tool]}
          setTool={props.setTool}
          setSidebarState={setState}
        />
      </li>
    )
  })

  let miscItems = ['clearer', 'hider'];
  let miscList = miscItems.map(item => {
    return (
      <li key={item}>
        <Misc name={item} icon={makeMiscItem(item, {}).getIcon()}
          config={props.config} setConfig={props.setConfig} 
          setIsSidebarVisible={props.setIsSidebarVisible}
        />
      </li>
    )
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
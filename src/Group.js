import React, { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tool from './Tool'
import { tools, icons } from './res/tools'
import './Group.scss'

function Group(props) {
  const ref = useRef(null)
  let initialState = {}
  for (let tool of tools[props.name]) {
    initialState[tool] = false
  }

  initialState[tools[props.name][0]] = true
  let [icon, setIcon] = useState(icons[props.name][tools[props.name][0]].split('+'))
  let [state, setState] = useState(initialState)
  let [isContentVisible, setIsContentVisible] = useState(false)
  let toolsGroup = tools[props.name].map(tool => {
    return (
      <li key={tool}>
        <Tool
          name={tool}
          icon={icons[props.name][tool]}
          parent={props.name}
          isSelected={state[tool]}
          setGroupIcon={setIcon}
          setGroupState={setState}
          setTool={props.setTool}
        />
      </li>
    )
  })

  useEffect(() => {
    if (isContentVisible) {
      function hideGroup(event) {
        if (event.target === ref.current ||
            ref.current.contains(event.target)) {
          return
        }

        setIsContentVisible(false)
      }

      document.addEventListener('mousedown', hideGroup)
      return () => {
        document.removeEventListener('mousedown', hideGroup)
      }
    }
  }, [isContentVisible])

  const handleClick = (event) => {
    event.stopPropagation()
    if (!props.isSelected) {
      for (let tool in state) {
        if (state[tool] === true) {
          props.setTool(tool)
        }
      }

      props.setSidebarState(prevSidebarState => {
        let newSidebarState = {}
        for (let key in prevSidebarState) {
          newSidebarState[key] = false
        }

        newSidebarState[props.name] = true
        return newSidebarState
      })
    }
  }

  const changeGroupVisibility = (event) => {
    event.stopPropagation()
    setIsContentVisible(!isContentVisible)
  }

  let arrowStyle = {}
  let blockStyle = {}
  if (props.isSelected) {
    arrowStyle = {
      borderLeft: '4.5px solid black'
    }

    blockStyle = {
      background: 'white',
      color: 'black'
    }
  }

  return (
    <div className='tool-group w-100' ref={ref} onClick={handleClick}>
      <span className='d-inline-block w-100' style={blockStyle}>
        <FontAwesomeIcon icon={icon} />
        <span className='show-hide' style={arrowStyle}
          onClick={changeGroupVisibility}></span>
      </span>

      {isContentVisible &&
        <ul>
          {toolsGroup}
        </ul>
      }
    </div>
  )
}

export default Group

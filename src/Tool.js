import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Tool.scss'

function Tool(props) {
  const handleClick = (event) => {
    event.stopPropagation()
    let tool = props.name

    props.setTool(tool)
    if (props.setSidebarState && !props.isSelected) {
      props.setSidebarState(prevSidebarState => {
        let newSidebarState = {}
        for (let key in prevSidebarState) {
            newSidebarState[key] = false
        }

        newSidebarState[props.name] = true
        return newSidebarState
      })
    } else {
      if (!props.isSelected) {
        props.setGroupIcon(props.icon.split('+'))
        props.setGroupState(prevGroupState => {
          let newGroupState = {}
          for (let key in prevGroupState) {
            if (key === props.name) {
              newGroupState[key] = !prevGroupState[key]
            } else {
              newGroupState[key] = false
            }
          }

          return newGroupState
        })
      }
    }
  }

  let style = {}
  if (props.isSelected) {
    style = {
      background: 'white',
      color: 'black'
    }
  }

  return (
    <span
      className='tool d-inline-block w-100' style={style}
      onClick={handleClick}>
      <FontAwesomeIcon icon={props.icon.split('+')} />
    </span>
  )
}

export default Tool

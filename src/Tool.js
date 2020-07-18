import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Tool.scss'

function Tool(props) {
  const handleClick = (event) => {
    event.stopPropagation()
    let tool = props.name
    if (props.isSelected) {
      tool = 'none'
    }

    props.setTool(tool)
    if (props.setSidebarState) {
      props.setSidebarState(prevSidebarState => {
        let newSidebarState = {}
        for (let key in prevSidebarState) {
          if (key === props.name) {
            newSidebarState[key] = !prevSidebarState[key]
          } else {
            newSidebarState[key] = false
          }
        }

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

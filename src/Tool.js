import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Tool.scss'

function Tool(props) {
  const handleClick = (event) => {
    event.stopPropagation()
    if (props.isSelected)
      props.setBoardCursor('')
    else
      props.setBoardCursor('cell')

    props.setSidebarState(prevState => {
      let newToolsInfo = prevState.toolsInfo.map(item => {
        let value = null
        if (item.name === props.icon)
          value = !item.value
          
        return { name: item.name, value: value }
      })

      return { toolsInfo: newToolsInfo }
    })
  }
  
  return (
    <span 
      className='tool w-100 d-inline-block' style={props.style} onClick={handleClick}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  )
}

export default Tool

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Tool.scss'

function Tool(props) {
  const handleClick = (event) => {
    event.stopPropagation()
    let tool = props.icon
    if (props.isSelected)
      tool = 'none'

    props.setTool(tool)
    props.setSidebarState(prevState => {
      let newToolsInfo = prevState.toolsInfo.map(item => {
        let value = false
        if (item.name === props.icon)
          value = !item.value

        return { name: item.name, value: value }
      })

      return { toolsInfo: newToolsInfo }
    })
  }

  return (
    <span
      className='tool d-inline-block w-100' style={props.style}
      onClick={handleClick}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  )
}

export default Tool

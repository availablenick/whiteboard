import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { behaviors } from './res/misc'
import './Misc.scss'

function Misc(props) {
  let params = {
    setIsSidebarVisible: props.setIsSidebarVisible
  }

  const handleClick = (event) => {
    behaviors[props.name](event, params)
  }

  return (
    <span
      className='misc circular d-inline-flex align-items-center justify-content-center'
      onClick={handleClick}>
      <FontAwesomeIcon icon={props.icon.split('+')} />
    </span>
  )
}

export default Misc

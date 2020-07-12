import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { behaviors } from './res/misc'
import './Misc.scss'

function Misc(props) {
  return (
    <span
      className='misc d-inline-flex align-items-center justify-content-center'
      onClick={behaviors[props.icon]}>
      <FontAwesomeIcon icon={props.icon.split('+')} />
    </span>
  )
}

export default Misc

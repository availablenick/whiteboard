import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { behaviors } from './res/misc'
import './Misc.scss'

function Misc(props) {
  return (
    <span
      className='misc circular d-inline-flex align-items-center justify-content-center'
      onClick={behaviors[props.name]}>
      <FontAwesomeIcon icon={props.icon.split('+')} />
    </span>
  )
}

export default Misc

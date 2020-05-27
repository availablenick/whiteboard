import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { behaviors } from './res/helpers.js'
import './Helper.scss'

function Helper(props) {
  return (
    <span
      className='helper d-inline-flex align-items-center justify-content-center'
      onClick={behaviors[props.icon]}>
      <FontAwesomeIcon icon={props.icon} />
    </span>
  )
}

export default Helper

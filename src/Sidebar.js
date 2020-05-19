import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Sidebar.scss'

function Sidebar() {
  return (
    <aside className='d-flex flex-column justify-content-between text-white'>
      <ul className='p-0 w-100'>
        <li><FontAwesomeIcon icon='pencil-alt' /></li>
        <li><FontAwesomeIcon icon='eraser' /></li>
        <li><FontAwesomeIcon icon='fill' /></li>
        <li><FontAwesomeIcon icon='font' /></li>
        <li><FontAwesomeIcon icon='eye-dropper' /></li>
        <li><FontAwesomeIcon icon='search' /></li>
      </ul>

      <span>
        <span><FontAwesomeIcon icon='bars' /></span>
      </span>
    </aside>
  )
}

export default Sidebar

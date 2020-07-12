import React, { useState, useEffect, useRef } from 'react'
import ColorPicker from './ColorPicker'
import './Color.scss'

function Color(props) {
  const colorViewerRef = useRef(null)
  const colorPickerRef = useRef(null)
  let [type, setType] = useState('drawing')
  let [isContentVisible, setIsContentVisible] = useState(false)

  const handleClick = (event) => {
    event.stopPropagation()
    let type = 'drawing'
    if (/erasing/.test(event.target.className)) {
      type = 'erasing'
    }

    setType(type)
    setIsContentVisible(!isContentVisible)
  }

  useEffect(() => {
    if (isContentVisible) {
      function hideContent(event) {
        if (event.target === colorPickerRef.current ||
          colorPickerRef.current.contains(event.target)) {
          return
        }

        if (event.target === colorViewerRef.current ||
          colorViewerRef.current.contains(event.target)) {
          return
        }

        setIsContentVisible(false)
      }

      document.addEventListener('mousedown', hideContent)
      return () => {
        document.removeEventListener('mousedown', hideContent)
      }
    }
  }, [isContentVisible])

  return (
    <div
      className='misc d-inline-flex align-items-center justify-content-center
        position-relative w-100'>

      <span className='color-viewer' ref={colorViewerRef}>
        <span className='highlightable drawing'
          style={{ background: props.config.drawing.color }}
          onClick={handleClick}></span>

        <span className='highlightable erasing'
          style={{ background: props.config.erasing.color }}
          onClick={handleClick}></span>
      </span>

      {isContentVisible &&
        <ColorPicker ref={colorPickerRef} type={type} config={props.config}
          setConfig={props.setConfig}/>
      }
    </div>
  )
}

export default Color

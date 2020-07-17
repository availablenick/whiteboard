import React, { useState, useEffect, useRef } from 'react'
import behaviors from '../res/resizing'
import { getQuadrant } from './helpers'
import './Rectangle.scss'
import '../res/resizable.scss'

function Rectangle(props) {
  const canvas = document.getElementById('canvas')
  const ref = useRef(null)
  let initialStyle = {
    left: '-500px',
    top: '-500px'
  }

  let [style, setStyle] = useState(initialStyle)
  let [stage, setStage] = useState('shaping')
  useEffect(() => {
    let newStyle = {
      border: '4px solid ' + props.config.drawing.color,
      height: 0,
      left: props.x + 'px',
      top: props.y + 'px',
      width: 0
    }

    const rectShape = ref.current
    setStyle(newStyle)

    return () => {
      const ctx = canvas.getContext('2d')
      const rect = rectShape.getBoundingClientRect()
      ctx.fillStyle = props.config.drawing.color
      ctx.strokeStyle = props.config.drawing.color
      ctx.lineWidth = 4
      ctx.strokeRect(
        rect.left - canvas.offsetLeft,
        rect.top - canvas.offsetTop,
        rect.width, rect.height
      )
    }
  }, [])

  useEffect(() => {
    if (/shaping/.test(stage)) {
      let newEvent = new MouseEvent('mousedown', { bubbles: true })
      ref.current.dispatchEvent(newEvent)
    } else {
      function removeShape(event) {
        if (event.target === ref.current ||
            ref.current.contains(event.target)) {
          return
        }

        props.setShapeState({
          isShaping: false,
        })
      }

      document.addEventListener('click', removeShape)
      return () => {
        document.removeEventListener('click', removeShape)
      }
    }
  }, [stage])

  const handleMouseDown = (event) => {
    event.stopPropagation()
    let handleMouseMove = null
    if (/shaping/.test(stage)) {
      event.persist()
      let p = { x: props.x, y: props.y }
      let corners = {
        1: 'top-right',
        2: 'top-left',
        3: 'bottom-left',
        4: 'bottom-right'
      }

      handleMouseMove = (eventz) => {
        let q = { x: eventz.clientX, y: eventz.clientY }
        behaviors[corners[getQuadrant(p, q)]](eventz, ref.current, setStyle,
          { height: 0, width: 0 })
      }
    } else {
      let shiftX = event.clientX - ref.current.offsetLeft
      let shiftY = event.clientY - ref.current.offsetTop
      handleMouseMove = (event) => {
        let xPos = event.clientX - shiftX
        let yPos = event.clientY - shiftY
        let canvasRight = canvas.offsetLeft + canvas.offsetWidth
        if (xPos < canvas.offsetLeft) {
          xPos = canvas.offsetLeft
        } else if (xPos + ref.current.offsetWidth > canvasRight) {
          xPos = canvasRight - ref.current.offsetWidth
        }

        let canvasBottom = canvas.offsetTop + canvas.offsetHeight
        if (yPos < canvas.offsetTop) {
          yPos = canvas.offsetTop
        } else if (yPos + ref.current.offsetHeight > canvasBottom) {
          yPos = canvasBottom - ref.current.offsetHeight
        }

        setStyle(prevStyle => {
          return {
            ...prevStyle,
            left: xPos + 'px',
            top: yPos + 'px',
          }
        })
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.onmouseup = (event) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.onmouseup = null
      if (/shaping/.test(stage)) {
        setStage('positioning')
      }
    }
  }

  let positions = [
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
    'top-left'
  ]

  let points = positions.map(item => {
    function resMouseDown(event) {
      event.persist()
      event.stopPropagation()
  
      function mouseMove(event) {
        behaviors[item](event, ref.current, setStyle, { height: 1, width: 1 })
      }

      document.addEventListener('mousemove', mouseMove)
      document.onmouseup = () => {
        document.removeEventListener('mousemove', mouseMove)
        document.onmouseup = null
        setStyle({
          bottom: '',
          height: ref.current.offsetHeight,
          left: ref.current.offsetLeft + 'px',
          right: '',
          top: ref.current.offsetTop + 'px',
          width: ref.current.offsetWidth + 'px',
        })
      }
    }

    return <div key={item} className={'res ' + item}
      onMouseDown={resMouseDown}></div>
  })

  return (
    <div className='rect-shape resizable' style={style} ref={ref}
      onMouseDown={handleMouseDown}>

      {stage === 'positioning' && points}
    </div>
  )
}

export default Rectangle

import React, { useState, useEffect, useRef } from 'react'
import { createCanvasChangeEvent } from '../res/helpers'
import { calculateAngle, distance } from './helpers'
import './Segment.scss'

function Segment(props) {
  const canvas = document.getElementById('canvas')
  const ref = useRef(null)
  let initialStyle = {
    left: '-500px',
    top: '-500px'
  }

  let [style, setStyle] = useState(initialStyle)
  let [state, setState] = useState({
    stage: 'shaping',
    fixedPoint: { x: props.x, y: props.y },
    fixedSide: 'left'
  })

  useEffect(() => {
    let newStyle = {
      background: props.config.drawing.color,
      left: props.x + 'px',
      top: props.y + 'px',
      transformOrigin: 'left center',
      width: 0
    }

    const lineShape = ref.current
    setStyle(newStyle)

    return () => {
      document.onmousemove = null
      document.onmouseup = null

      const ctx = canvas.getContext('2d')
      const leftR = lineShape.getElementsByClassName('left')[0].getBoundingClientRect()
      const rightR = lineShape.getElementsByClassName('right')[0].getBoundingClientRect()
      ctx.fillStyle = props.config.drawing.color
      ctx.strokeStyle = props.config.drawing.color
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(leftR.x - canvas.offsetLeft, leftR.y - canvas.offsetTop)
      ctx.lineTo(rightR.x - canvas.offsetLeft, rightR.y - canvas.offsetTop)
      ctx.stroke()
      ctx.closePath()

      canvas.dispatchEvent(createCanvasChangeEvent())
    }
  }, [])

  useEffect(() => {
    if (/shaping/.test(state.stage)) {
      let newEvent = new MouseEvent('mousedown', { bubbles: true })
      ref.current.dispatchEvent(newEvent)
    } else {
      setStyle({
        ...style,
        cursor: 'move'
      })

      function removeShape(event) {
        if (event.target === ref.current) {
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
  }, [state])

  const handleMouseDown = (event) => {
    event.preventDefault()
    if (/shaping/.test(state.stage)) {
      document.onmousemove = (event) => {
        event.stopPropagation()
        let q = { x: event.clientX, y: event.clientY }

        let canvasRight = canvas.offsetLeft + canvas.offsetWidth
        if (q.x < canvas.offsetLeft) {
          q.x = canvas.offsetLeft
        } else if (q.x  > canvasRight) {
          q.x = canvasRight
        }

        let canvasBottom = canvas.offsetTop + canvas.offsetHeight
        if (q.y < canvas.offsetTop) {
          q.y = canvas.offsetTop
        } else if (q.y > canvasBottom) {
          q.y = canvasBottom
        }

        let width = distance(state.fixedPoint, q)
        let angle = calculateAngle(state.fixedPoint, q)
        if (state.fixedSide === 'right') {
          angle = -(180 - angle)
        }

        setStyle(prevStyle => {
          return {
            ...prevStyle,
            transform: 'rotate(' + angle + 'deg)',
            width: width + 'px'
          }
        })
      }
    } else {
      const rect = ref.current.getBoundingClientRect()
      let shiftX = event.clientX - rect.left
      let shiftY = event.clientY - rect.top
      document.onmousemove = (event) => {
        let xPos = event.clientX - shiftX
        let yPos = event.clientY - shiftY
        let canvasRight = canvas.offsetLeft + canvas.offsetWidth
        if (xPos < canvas.offsetLeft) {
          xPos = canvas.offsetLeft
        } else if (xPos + rect.width > canvasRight) {
          xPos = canvasRight - rect.width
        }

        let canvasBottom = canvas.offsetTop + canvas.offsetHeight
        if (yPos < canvas.offsetTop) {
          yPos = canvas.offsetTop
        } else if (yPos + rect.height > canvasBottom) {
          yPos = canvasBottom - rect.height
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

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      if (/shaping/.test(state.stage)) {
        setState({
          ...state,
          stage: 'positioning'
        })
      }
    }
  }

  let positions = ['left', 'right']
  let points = positions.map(position => {
    const resMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
      const pointRect = event.target.getBoundingClientRect()
      const segRect = ref.current.getBoundingClientRect()
      if (position === 'left') {
        let x = null
        if (Math.abs(pointRect.left - segRect.left) < Math.abs(pointRect.right - segRect.right)) {
          x = segRect.right
        } else {
          x = segRect.left
        }

        let y = null
        if (Math.abs(pointRect.top - segRect.top) < Math.abs(pointRect.bottom - segRect.bottom)) {
          y = segRect.bottom
        } else {
          y = segRect.top
        }

        setStyle({
          ...style,
          bottom: (window.innerHeight - y) + 'px',
          left: '',
          right: (window.innerWidth - x) + 'px',
          top: '',
          transformOrigin: 'right center',
        })

        setState({
          stage: 'reshaping',
          fixedPoint: { x: x, y: y },
          fixedSide: 'right'
        })
      } else {
        let x = null
        if (Math.abs(pointRect.x - segRect.left) < Math.abs(pointRect.x - segRect.right)) {
          x = segRect.right
        } else {
          x = segRect.left
        }
        
        let y = null
        if (Math.abs(pointRect.y - segRect.top) < Math.abs(pointRect.y - segRect.bottom)) {
          y = segRect.bottom
        } else {
          y = segRect.top
        }

        setStyle({
          ...style,
          bottom: '',
          left: x + 'px',
          right: '',
          top: y + 'px',
          transformOrigin: 'left center',
        })

        setState({
          stage: 'reshaping',
          fixedPoint: { x: x, y: y },
          fixedSide: 'left'
        })
      }
    }

    return <div key={position} className={'res ' + position}
      onMouseDown={resMouseDown}></div>
  })

  return (
    <div className='line-shape' style={style} ref={ref}
      onMouseDown={handleMouseDown}>

      {(state.stage === 'positioning' || state.stage === 'reshaping') && points}
    </div>
  )
}

export default Segment

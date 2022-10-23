import React, { useState, useEffect, useRef } from 'react'
import { adjustToCanvasLeft, adjustToCanvasTop, drawText } from './helpers'
import behaviors from '../res/resizing'
import './TextBlock.scss'
import '../res/resizable.scss'

let rowHeight = 0
let removal = {
  shouldRemove: true,
  target: null
}

function TextBlock(props) {
  const canvas = document.getElementById('canvas')
  const ref = useRef(null)
  let initialStyle = {
    left: '-500px',
    top: '-500px'
  }

  let [style, setStyle] = useState(initialStyle)
  useEffect(() => {
    let newStyle = {
      bottom: '',
      height: '',
      left: adjustToCanvasLeft(props.x, canvas, ref.current) + 'px',
      right: '',
      top: adjustToCanvasTop(props.y, canvas, ref.current) + 'px',
      width: '',
    }

    setStyle(newStyle)
    const textarea = document.getElementsByTagName('textarea')[0]
    rowHeight = textarea.offsetHeight / Number(textarea.rows)
    function handleDocClick(event) {
      if (event.target === ref.current || ref.current.contains(event.target)) {
        return
      }

      const context = canvas.getContext('2d')
      context.fillStyle = props.config.drawing.color
      context.strokeStyle = props.config.drawing.color
      drawText(canvas, textarea, rowHeight)
      if (removal.shouldRemove) {
        props.setTextState({
          isWriting: false,
          x: -1,
          y: -1
        })
      } else {
        let newEvent = new MouseEvent('mouseup')
        removal.target.dispatchEvent(newEvent)
      }
    }

    document.addEventListener('click', handleDocClick)
    textarea.focus()

    return () => {
      document.onmousemove = null
      document.onmouseup = null
      document.removeEventListener('click', handleDocClick)
    }
  }, [])

  const handleClick = (event) => {
    if (event.target !== removal.target && removal.target !== null) {
      let newEvent = new MouseEvent('mouseup')
      removal.target.dispatchEvent(newEvent)
    }
  }

  const handleMouseDown = (event) => {
    event.preventDefault()
    event.persist()
    let shiftX = event.clientX - ref.current.offsetLeft
    let shiftY = event.clientY - ref.current.offsetTop
    removal.shouldRemove = false
    removal.target = ref.current

    document.onmousemove = (event) => {
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
          top: yPos + 'px'
        }
      })
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      removal.shouldRemove = true
      removal.target = null
    }
  }

  const handleChange = (event) => {
    const context = canvas.getContext('2d')
    const textarea = event.target
    context.font = window.getComputedStyle(textarea).getPropertyValue('font')

    let rows = 1
    let currentWidth = 0
    for (let char of textarea.value) {
      if (char === '\n') {
        rows++
        currentWidth = 0
        continue
      }

      if (currentWidth + context.measureText(char).width > textarea.offsetWidth) {
        rows++
        currentWidth = context.measureText(char).width
      } else {
        currentWidth += context.measureText(char).width
      }
    }

    if (rows > Number(textarea.rows)) {
      let canvasBottom = canvas.offsetTop + canvas.offsetHeight
      let topWithBorder = ref.current.offsetTop + 2 * ref.current.clientTop
      let blockHeight = ''
      if (topWithBorder + rows * rowHeight > canvasBottom) {
        let height = canvasBottom - topWithBorder
        rows = Math.floor(height / rowHeight)
        blockHeight = height + 'px'
      }

      setStyle(prevStyle => {
        return {
          ...prevStyle,
          height: blockHeight
        }
      })

      textarea.rows = rows
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
      event.preventDefault()
      event.persist()
      event.stopPropagation()
      removal.shouldRemove = false
      removal.target = event.target
  
      document.onmousemove = (event) => {
        behaviors[item](event, ref.current, setStyle, { height: 25, width: 25 })
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        setStyle({
          bottom: '',
          height: ref.current.offsetHeight,
          left: ref.current.offsetLeft + 'px',
          right: '',
          top: ref.current.offsetTop + 'px',
          width: ref.current.offsetWidth + 'px',
        })

        const textarea = ref.current.getElementsByTagName('textarea')[0]
        let newRowsNumber = textarea.offsetHeight / rowHeight
        if (newRowsNumber < 1) {
          newRowsNumber = 1
        }

        textarea.rows = newRowsNumber
        removal.shouldRemove = true
        removal.target = null
      }
    }

    return <div key={item} className={'res ' + item}
      onMouseDown={resMouseDown}></div>
  })

  return (
    <div className='text-block resizable' style={style} ref={ref}
      onMouseDown={handleMouseDown}
      onClick={handleClick}>
      {points}
      <textarea rows='1' cols='7' style={{ color: props.config.drawing.color }}
        onMouseDown={(event) => { event.stopPropagation() }}
        onChange={handleChange}></textarea>
    </div>
  )
}

export default TextBlock

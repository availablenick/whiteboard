import React, { useState, useEffect, useRef, forwardRef } from 'react'
import {
  getSelectorColorFromPos,
  getSelectorPosFromColor,
  getSliderColorFromPos,
  getSliderColorFromSelectorColor,
  getSliderPosFromColor
} from './helpers'

import './ColorPicker.scss'

const ColorPicker = forwardRef((props, ref) => {
  const lightChangerRef = useRef(null)
  const selectorRef = useRef(null)
  const alphaSliderRef = useRef(null)
  const alphaChangerRef = useRef(null)
  const colorChangerRef = useRef(null)
  const colorSliderRef = useRef(null)

  let [selectorStyle, setSelectorStyle] = useState({})
  let [alphaSliderStyle, setAlphaSliderStyle] = useState({})
  let [colorSliderStyle, setColorSliderStyle] = useState({})
  let [selectorColor, setSelectorColor] = useState(props.config[props.type].color)
  let [sliderColor, setSliderColor] = useState(
    getSliderColorFromSelectorColor(props.config[props.type].color)
  )

  useEffect(() => {
    let [selectorX, selectorY] = getSelectorPosFromColor(selectorColor)
    let colorSliderY = getSliderPosFromColor(sliderColor)
    let selectorLeft = lightChangerRef.current.offsetWidth * selectorX -
      selectorRef.current.offsetWidth / 2

    let selectorTop = lightChangerRef.current.offsetHeight * selectorY -
      selectorRef.current.offsetHeight / 2

    let m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(selectorColor)
    let alphaSliderTop = 1
    if (m[4]) {
      let alpha = Number(m[5] + m[6])
      alphaSliderTop = alphaChangerRef.current.offsetHeight * (1 - alpha)
    }

    let colorSliderTop = colorChangerRef.current.offsetHeight * colorSliderY
    setSelectorStyle({
      left: selectorLeft + 'px',
      top: selectorTop + 'px'
    })

    setAlphaSliderStyle({
      top: alphaSliderTop + 'px'
    })

    setColorSliderStyle({
      top: colorSliderTop + 'px'
    })

    const lightChanger = lightChangerRef.current
    const selector = selectorRef.current
    const alphaChanger = alphaChangerRef.current
    const alphaSlider = alphaSliderRef.current
    const colorChanger = colorChangerRef.current
    const colorSlider = colorSliderRef.current

    return () => {
      document.onmousemove = null
      document.onmouseup = null

      let colorSliderYTotal = colorSlider.offsetTop / colorChanger.offsetHeight
      let finalSliderColor = getSliderColorFromPos(colorSliderYTotal)
      let x = selector.offsetLeft + selector.offsetWidth / 2
      let y = selector.offsetTop + selector.offsetHeight / 2
      let xTotal = x / lightChanger.offsetWidth
      let yTotal = y / lightChanger.offsetHeight
      let [r, g, b] = getSelectorColorFromPos(xTotal, yTotal, finalSliderColor)
      let color = 'rgb(' + r + ', ' + g + ', ' + b + ')'
      let alpha = 1 - alphaSlider.offsetTop / alphaChanger.offsetHeight
      alpha = Math.floor(alpha * 1000) / 1000
      if (alpha < 1) {
        color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
      }

      props.setConfig(prevConfig => {
        return {
          ...prevConfig,
          [props.type]: { color: color }
        }
      })
    }
  }, [])

  useEffect(() => {
    let x = selectorRef.current.offsetLeft + selectorRef.current.offsetWidth / 2
    let y = selectorRef.current.offsetTop + selectorRef.current.offsetHeight / 2
    let xTotal = x / lightChangerRef.current.offsetWidth
    let yTotal = y / lightChangerRef.current.offsetHeight
    let [r, g, b] = getSelectorColorFromPos(xTotal, yTotal, sliderColor)
    let color = 'rgb(' + r + ', ' + g + ', ' + b + ')'
    let alpha = 1 - alphaSliderRef.current.offsetTop / alphaChangerRef.current.offsetHeight
    alpha = Math.floor(alpha * 1000) / 1000
    if (alpha < 1) {
      color = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
    }

    setSelectorColor(color)
  }, [selectorStyle, sliderColor, alphaSliderStyle])

  useEffect(() => {
    let yTotal = colorSliderRef.current.offsetTop / colorChangerRef.current.offsetHeight
    let color = getSliderColorFromPos(yTotal)
    setSliderColor(color)
  }, [colorSliderStyle])

  function getSelectorCoords(event) {
    const selector = selectorRef.current
    const lightChangerRect = lightChangerRef.current.getBoundingClientRect()
    let halfWidth = selector.offsetWidth / 2
    let halfHeight = selector.offsetHeight / 2
    let left = event.clientX - halfWidth - lightChangerRect.left
    let top = event.clientY - halfHeight - lightChangerRect.top
    if (left < -halfWidth) {
      left = -halfWidth
    } else if (left + selector.offsetWidth > lightChangerRect.width + halfWidth) {
      left = lightChangerRect.width + halfWidth - selector.offsetWidth
    }

    if (top < -halfHeight) {
      top = -halfHeight
    } else if (top + selector.offsetHeight > lightChangerRect.height + halfHeight) {
      top = lightChangerRect.height + halfHeight - selector.offsetHeight
    }

    return [left, top]
  }

  const handleLightChangerMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    let [left, top] = getSelectorCoords(event)
    setSelectorStyle({
      ...selectorStyle,
      left: left + 'px',
      top: top + 'px'
    })

    let newEvent = new MouseEvent('mousedown', { bubbles: true })
    selectorRef.current.dispatchEvent(newEvent)
  }

  const handleSelectorMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    document.onmousemove = (event) => {
      let [left, top] = getSelectorCoords(event)
      setSelectorStyle({
        ...selectorStyle,
        left: left + 'px',
        top: top + 'px'
      })
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
    }
  }

  const handleAlphaChangerMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const alphaChangerRect = alphaChangerRef.current.getBoundingClientRect()
    let top = event.clientY - (alphaSliderRef.current.offsetHeight / 2) -
      alphaChangerRect.top

    if (top < 0) {
      top = 0
    } else if (top > alphaChangerRect.height) {
      top = alphaChangerRect.height
    }

    setAlphaSliderStyle(prevAlphaSliderStyle => {
      return {
        ...prevAlphaSliderStyle,
        top: top + 'px'
      }
    })

    let newEvent = new MouseEvent('mousedown', { bubbles: true })
    alphaSliderRef.current.dispatchEvent(newEvent)
  }

  const handleAlphaSliderMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const alphaChangerRect = alphaChangerRef.current.getBoundingClientRect()
    setAlphaSliderStyle(prevAlphaSliderStyle => {
      return {
        ...prevAlphaSliderStyle,
        cursor: 'grabbing'
      }
    })

    document.onmousemove = (event) => {
      let top = event.clientY - alphaChangerRect.top
      if (top < 0) {
        top = 0
      } else if (top > alphaChangerRect.height) {
        top = alphaChangerRect.height
      }

      setAlphaSliderStyle(prevAlphaSliderStyle => {
        return {
          ...prevAlphaSliderStyle,
          top: top + 'px'
        }
      })
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setAlphaSliderStyle(prevAlphaSliderStyle => {
        return {
          ...prevAlphaSliderStyle,
          cursor: 'grab'
        }
      })
    }
  }

  const handleColorChangerMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const colorChangerRect = colorChangerRef.current.getBoundingClientRect()
    let top = event.clientY - (colorSliderRef.current.offsetHeight / 2) - colorChangerRect.top
    if (top < 0) {
      top = 0
    } else if (top > colorChangerRect.height) {
      top = colorChangerRect.height
    }

    setColorSliderStyle(prevColorSliderStyle => {
      return {
        ...prevColorSliderStyle,
        top: top + 'px'
      }
    })

    let newEvent = new MouseEvent('mousedown', { bubbles: true })
    colorSliderRef.current.dispatchEvent(newEvent)
  }

  const handleColorSliderMouseDown = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const colorChangerRect = colorChangerRef.current.getBoundingClientRect()
    setColorSliderStyle(prevColorSliderStyle => {
      return {
        ...prevColorSliderStyle,
        cursor: 'grabbing'
      }
    })

    document.onmousemove = (event) => {
      let top = event.clientY - colorChangerRect.top
      if (top < 0) {
        top = 0
      } else if (top > colorChangerRect.height) {
        top = colorChangerRect.height
      }

      setColorSliderStyle(prevColorSliderStyle => {
        return {
          ...prevColorSliderStyle,
          top: top + 'px'
        }
      })
    }

    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      setColorSliderStyle(prevColorSliderStyle => {
        return {
          ...prevColorSliderStyle,
          cursor: 'grab'
        }
      })
    }
  }

  let viewerTextColor = 'black'
  let m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(selectorColor)
  let [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (r + g + b < 128 * 3) {
    viewerTextColor = 'white'
  }

  let rgbSelector = 'rgb(' + r + ', ' + g + ', ' + b + ')'
  let lightChangerBg = 'linear-gradient(to bottom, transparent, black), ' +
    'linear-gradient(to right, white, ' + sliderColor + ')'

  let alphaChangerBg = 'linear-gradient(' + rgbSelector + ', transparent), ' +
    'linear-gradient(45deg, #555 25%, transparent 25%), ' +
    'linear-gradient(45deg, #555 25%, transparent 25%), ' +
    'linear-gradient(45deg, transparent 75%, #555 75%), ' +
    'linear-gradient(45deg, transparent 75%, #555 75%)'

  return (
    <div className='color-picker d-flex flex-column position-absolute p-3'
      ref={ref}>
        <div className='viewer d-flex align-items-center justify-content-center'
          style={{ background: selectorColor, color: viewerTextColor }}>
          {selectorColor}
        </div>

        <div className='bottom d-flex mt-2'>
          <div className='light-changer d-flex position-relative overflow-hidden'
            style={{ background: lightChangerBg }}
            ref={lightChangerRef}
            onMouseDown={handleLightChangerMouseDown}>

            <div className='selector d-inline-block position-absolute'
              style={selectorStyle}
              ref={selectorRef}
              onMouseDown={handleSelectorMouseDown}></div>
          </div>

          <div className='alpha-changer d-flex position-relative ml-3'
            ref={alphaChangerRef}
            style={{
              backgroundImage: alphaChangerBg,
              backgroundPosition: 'center, 0px 0px, 5px 5px, 5px 5px, 0px 0px',
              backgroundSize: 'auto, 10px 10px, 10px 10px, 10px 10px, 10px 10px',
              cursor: alphaSliderStyle.cursor
            }}
            onMouseDown={handleAlphaChangerMouseDown}>

            <div className='slider d-inline-block position-absolute'
              style={alphaSliderStyle}
              ref={alphaSliderRef}
              onMouseDown={handleAlphaSliderMouseDown}></div>
          </div>

          <div className='color-changer d-flex position-relative ml-3'
            ref={colorChangerRef}
            style={{ cursor: colorSliderStyle.cursor }}
            onMouseDown={handleColorChangerMouseDown}>

            <div className='slider d-inline-block position-absolute'
              style={colorSliderStyle}
              ref={colorSliderRef}
              onMouseDown={handleColorSliderMouseDown}></div>
          </div>
        </div>
    </div>
  )
})

export default ColorPicker

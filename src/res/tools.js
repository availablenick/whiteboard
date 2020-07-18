const tools = {
  pencil: null,
  eraser: null,
  filler: null,
  text: null,
  shapes: [
    'line',
    'rectangle',
    'circle'
  ],

  'eye-dropper': null,
  zoom: null
}

const icons = {
  pencil: 'fas+pencil-alt',
  eraser: 'fas+eraser',
  filler: 'fas+fill',
  text: 'fas+font',
  shapes: {
    line: 'fas+slash',
    rectangle: 'far+square',
    circle: 'far+circle'
  },

  'eye-dropper': 'fas+eye-dropper',
  zoom: 'fas+search',
}

const cursors = {
  pencil: 'cell',
  eraser: (params) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = params.config.eraser.size
    canvas.height = params.config.eraser.size
    ctx.fillStyle = params.config.erasing.color
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    ctx.fillRect(1, 1, canvas.width - 2, canvas.height - 2)
    let dataURL = canvas.toDataURL()

    return 'url("' + dataURL + '"), auto'
  },

  filler: 'no-drop',
  text: 'text',
  line: 'crosshair',
  rectangle: 'crosshair',
  circle: 'crosshair',
  'eye-dropper': 'alias',
  zoom: 'cell',
}

const behaviors = {
  pencil: (event, params) => {
    const canvas = event.target
    const context = canvas.getContext('2d')
    let x = event.clientX - canvas.offsetLeft
    let y = event.clientY - canvas.offsetTop
    let prevX = x - event.movementX
    let prevY = y - event.movementY

    context.fillStyle = params.config.drawing.color
    context.strokeStyle = params.config.drawing.color
    if (event.type === 'mousedown') {
      context.fillRect(x, y, 2, 2)
    } else {
      context.lineWidth = 2
      context.beginPath()
      context.moveTo(prevX, prevY)
      context.lineTo(x, y)
      context.stroke()
      context.closePath()
    }
  },

  eraser: (event, params) => {
    if (event.type === 'keydown') {
      if (event.shiftKey && !event.ctrlKey) {
        if (event.key === '+') {
          let newSize = params.config.eraser.size + 1
          if (newSize > 48) {
            newSize = 48
          }

          params.setConfig({
            ...params.config,
            eraser: { size: newSize }
          })
        } else if (event.key === '-') {
          let newSize = params.config.eraser.size - 1
          if (newSize < 4) {
            newSize = 4
          }

          params.setConfig({
            ...params.config,
            eraser: { size: newSize }
          })
        }
      }

      return
    }

    const size = params.config.eraser.size
    const canvas = event.target
    const context = canvas.getContext('2d')
    let x = event.clientX - canvas.offsetLeft
    let y = event.clientY - canvas.offsetTop
    let prevX = x - event.movementX
    let prevY = y - event.movementY

    context.fillStyle = params.config.erasing.color
    context.strokeStyle = params.config.erasing.color
    if (event.type === 'mousedown') {
      context.fillRect(x, y, size, size)
    } else {
      let a = (y - prevY) / (x - prevX)
      if (x === prevX) {
        let yCoord = prevY
        while (yCoord !== y) {
          context.fillRect(x, yCoord, size, size)
          if (prevY < y)
            yCoord += 1
          else
            yCoord -= 1
        }
      } else {
        let xCoord = prevX
        let lastY = prevY
        while (true) {
          let yCoord = a * (xCoord - x) + y
          context.fillRect(xCoord, yCoord, size, size)

          let vertLineXCoord = -1
          if (prevX < x) {
            vertLineXCoord = xCoord - 1
            xCoord += 1
            if (xCoord > x + 1)
              break
          } else {
            vertLineXCoord = xCoord + 1
            xCoord -= 1
            if (xCoord < x - 1)
              break
          }

          if (lastY !== yCoord) {
            let yAux = lastY
            while (true) {
              context.fillRect(vertLineXCoord, yAux, size, size)
              if (yAux < yCoord) {
                yAux++
                if (yAux >= yCoord - 1)
                  break
              } else {
                yAux--
                if (yAux <= yCoord + 1)
                  break
              }
            }
          }

          lastY = yCoord
        }
      }
    }
  },

  filler: (event, params) => {
    if (event.type === 'mousedown') {
      const canvas = event.target
      const context = canvas.getContext('2d')
      context.fillStyle = params.config.drawing.color
      context.strokeStyle = params.config.drawing.color
      context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    }
  },

  text: (event, params) => {
    if (event.type === 'click') {
      params.setTextState({
        isWriting: true,
        x: event.clientX,
        y: event.clientY
      })
    }
  },

  line: (event, params) => {
    if (event.type === 'mousemove') {
      if (!params.prevShapeState.isShaping) {
        params.setShapeState({
          isShaping: true,
          shape: 'segment',
          x: event.clientX,
          y: event.clientY
        })
      }
    }
  },

  rectangle: (event, params) => {
    if (event.type === 'mousemove') {
      if (!params.prevShapeState.isShaping) {
        params.setShapeState({
          isShaping: true,
          shape: 'rectangle',
          x: event.clientX,
          y: event.clientY
        })
      }
    }
  },

  circle: (event, params) => {
    if (event.type === 'mousemove') {
      if (!params.prevShapeState.isShaping) {
        params.setShapeState({
          isShaping: true,
          shape: 'circle',
          x: event.clientX,
          y: event.clientY
        })
      }
    }
  },

  'eye-dropper': (event, params) => {
    if (event.type === 'mousedown') {
      const canvas = event.target
      const context = canvas.getContext('2d')
      let x = event.clientX - canvas.offsetLeft
      let y = event.clientY - canvas.offsetTop

      let pixel = context.getImageData(x, y, 1, 1)
      let color = 'rgba(' +
        pixel.data[0] + ', ' +
        pixel.data[1] + ', ' +
        pixel.data[2] + ', ' +
        (pixel.data[3] / 255) + ')'

      params.setConfig(prevConfig => {
        return {
          ...prevConfig,
          drawing: {
            color: color
          }
        }
      })
    }
  },

  zoom: (event, params) => {

  },
}

exports.tools = tools
exports.icons = icons
exports.cursors = cursors
exports.behaviors = behaviors

const tools = {
  'fas+pencil-alt': null,
  'fas+eraser': null,
  'fas+fill': null,
  'fas+font': null,
  'shapes': [
    'fas+slash',
    'far+square',
    'far+circle'
  ],

  'fas+eye-dropper': null,
  'fas+search': null
}

let c = document.createElement('canvas')
c.height = 32
c.width = 32
let ctx = c.getContext('2d')
ctx.fillStyle = '#fff'
ctx.strokeRect(0, 0, c.width, c.height)
ctx.fillRect(1, 1, c.width - 2, c.height - 2)
let dataURL = c.toDataURL()

const cursors = {
  'fas+pencil-alt': 'cell',
  'fas+eraser': 'url("' + dataURL + '"), auto',
  'fas+fill': 'no-drop',
  'fas+font': 'text',
  'fas+slash': 'crosshair',
  'far+square': 'crosshair',
  'far+circle': 'crosshair',
  'fas+eye-dropper': 'alias',
  'fas+search': 'cell',
  'fas+none': ''
}

const behaviors = {
  'fas+pencil-alt': (event, params) => {
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

  'fas+eraser': (event, params) => {
    const canvas = event.target
    const context = canvas.getContext('2d')
    let x = event.clientX - canvas.offsetLeft
    let y = event.clientY - canvas.offsetTop
    let prevX = x - event.movementX
    let prevY = y - event.movementY

    context.fillStyle = params.config.erasing.color
    context.strokeStyle = params.config.erasing.color
    if (event.type === 'mousedown') {
      context.fillRect(x, y, 32, 32)
    } else {
      let a = (y - prevY) / (x - prevX)
      if (x === prevX) {
        let yCoord = prevY
        while (yCoord !== y) {
          context.fillRect(x, yCoord, 32, 32)
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
          context.fillRect(xCoord, yCoord, 32, 32)

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
              context.fillRect(vertLineXCoord, yAux, 32, 32)
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

  'fas+fill': (event, params) => {
    if (event.type === 'mousedown') {
      const canvas = event.target
      const context = canvas.getContext('2d')
      context.fillStyle = params.config.drawing.color
      context.strokeStyle = params.config.drawing.color
      context.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
    }
  },

  'fas+font': (event, params) => {
    if (event.type === 'click') {
      params.setTextState({
        isWriting: true,
        x: event.clientX,
        y: event.clientY
      })
    }
  },

  'fas+slash': (event, params) => {
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

  'far+square': (event, params) => {
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

  'far+circle': (event, params) => {
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

  'fas+eye-dropper': (event, params) => {
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

  'fas+search': (event, params) => {

  },

  'none': () => {}
}

exports.tools = tools
exports.cursors = cursors
exports.behaviors = behaviors

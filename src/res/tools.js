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

  'eye-dropper': null
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

  'eye-dropper': 'fas+eye-dropper'
}

const getIcon = (iconCode, x, y) => {
  let canvasSize = 24
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = canvasSize
  canvas.height = canvasSize
  ctx.fillStyle = '#000'
  ctx.font = '900 ' + (canvasSize - 4) + 'px "Font Awesome 5 Free"'
  ctx.shadowBlur = '5'
  ctx.shadowColor = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('', 0, 0);

  return new Promise(resolve => {
    document.fonts.ready.then(() => {
      ctx.fillText(iconCode, canvasSize/2, canvasSize/2)
      let dataURL = canvas.toDataURL()
      resolve(`url("${dataURL}") ${x} ${y}, auto`)
    })
  })
}

const cursors = {
  pencil: () => getIcon('\uf303', 2, 21),
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

  filler: () => getIcon('\uf575', 10, 10),
  text: 'text',
  line: 'crosshair',
  rectangle: 'crosshair',
  circle: 'crosshair',
  'eye-dropper': () => getIcon('\uf1fb', 2, 21)
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
      let match = /rgba?\((\d+), ?(\d+), ?(\d+)(, ?(\d+))?\)/.exec(params.config.drawing.color)
      let red = Number(match[1])
      let green = Number(match[2])
      let blue = Number(match[3])
      let alpha = match[5] ? Number(match[5]) : 1
      let drawingColor = [red, green, blue, alpha]

      let initialX = event.clientX - canvas.offsetLeft
      let initialY = event.clientY - canvas.offsetTop
      let initialPixelData = context.getImageData(initialX, initialY, 1, 1).data
      let initialColor = [
        initialPixelData[0], initialPixelData[1], initialPixelData[2], initialPixelData[3] / 255,
      ]

      function shouldFill(x, y) {
        let pixelData = context.getImageData(x, y, 1, 1).data
        return (
          (
            pixelData[0] !== drawingColor[0] ||
            pixelData[1] !== drawingColor[1] ||
            pixelData[2] !== drawingColor[2] ||
            (pixelData[3] / 255) !== drawingColor[3]
          ) &&
          (
            pixelData[0] === initialColor[0] &&
            pixelData[1] === initialColor[1] &&
            pixelData[2] === initialColor[2] &&
            (pixelData[3] / 255) === initialColor[3]
          )
        )
      }

      function scan(lx, rx, y, q) {
        let foundBoundary = true
        for (let x = lx; x <= rx; ++x) {
          if (!shouldFill(x, y)) {
            foundBoundary = true
          } else if (foundBoundary) {
            q.push([x, y])
            foundBoundary = false
          }
        }
      }

      if (!shouldFill(initialX, initialY)) {
        return
      }

      let queue = [[initialX, initialY]]
      while (queue.length > 0) {
        let pos = queue.shift()
        let x = pos[0]
        let y = pos[1]
        let lx = x
        while (lx >= 1 && shouldFill(lx - 1, y)) {
          --lx
        }

        while (x < canvas.width && shouldFill(x, y)) {
          ++x
        }

        context.fillRect(lx, y, x - lx, 1)
        if (y >= 1) {
          scan(lx, x - 1, y - 1, queue)
        }

        if (y + 1 < canvas.width) {
          scan(lx, x - 1, y + 1, queue)
        }
      }
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
      let y = event.clientY + 19 - canvas.offsetTop

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
  }
}

exports.tools = tools
exports.icons = icons
exports.cursors = cursors
exports.behaviors = behaviors

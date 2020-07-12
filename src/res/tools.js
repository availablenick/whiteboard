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
  'fas+pencil-alt': (event) => {
    const canvas = event.target
    const context = canvas.getContext('2d')
    let x = event.clientX - canvas.offsetLeft
    let y = event.clientY - canvas.offsetTop
    let prevX = x - event.movementX
    let prevY = y - event.movementY

    if (event.type === 'mousedown') {
      context.fillStyle = '#000'
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

  'fas+eraser': (event) => {
    const canvas = event.target
    const context = canvas.getContext('2d')
    let x = event.clientX - canvas.offsetLeft
    let y = event.clientY - canvas.offsetTop
    let prevX = x - event.movementX
    let prevY = y - event.movementY

    context.fillStyle = 'green'
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

  'fas+fill': (event) => {
    if (event.type === 'mousedown') {
      const canvas = event.target
      const context = canvas.getContext('2d')
      let initialX = event.clientX - canvas.offsetLeft
      let initialY = event.clientY - canvas.offsetTop
      let initialPixel = context.getImageData(initialX, initialY, 1, 1)
      let initialColor = 'rgb(' +
          initialPixel.data[0] + ', ' +
          initialPixel.data[1] + ', ' +
          initialPixel.data[2] + ')'

      const compareColors = (c1, c2) => {
        let regex = /\((\d+), (\d+), (\d+)\)/i
        let m1 = regex.exec(c1)
        regex.lastIndex = 0
        let m2 = regex.exec(c2)
        for (let i = 1; i < 4; i++) {
          if (Math.abs(m1[i] - m2[i]) > 10)
            return -1
        }

        return 0
      }

      let paintingColor = 'rgb(0, 0, 255)'
      context.fillStyle = paintingColor
      if (compareColors(initialColor, paintingColor) === 0)
        return

      let grid = []
      for (let i = 0; i < canvas.width; i++) {
        grid[i] = []
        for (let j = 0; j < canvas.height; j++) {
          grid[i][j] = false
        }
      }

      let queue = [[initialX, initialY]]
      while (queue.length > 0) {
        let [x, y] = queue.shift()
        context.fillRect(x, y, 1, 1)
        let neighbors = [
          [x - 1, y],
          [x + 1, y],
          [x, y + 1],
          [x, y - 1]
        ]

        for (let [nextX, nextY] of neighbors) {
          if (0 <= nextX && nextX < canvas.width &&
            0 <= nextY && nextY < canvas.height) {

            let pixel = context.getImageData(nextX, nextY, 1, 1)
            let color = 'rgb(' +
              pixel.data[0] + ', ' +
              pixel.data[1] + ', ' +
              pixel.data[2] + ')'

            if (grid[nextX][nextY] === false &&
                compareColors(color, initialColor) === 0) {

              grid[nextX][nextY] = true
              queue.push([nextX, nextY])
            }
          }
        }
      }
    }
  },

  'fas+font': (event, setTextState) => {
    if (event.type === 'click') {
      setTextState({
        isWriting: true,
        x: event.clientX,
        y: event.clientY
      })
    }
  },

  'fas+slash': (event, setShapeState, prevShapeState) => {
    if (event.type === 'mousemove') {
      if (!prevShapeState.isShaping) {
        setShapeState({
          isShaping: true,
          shape: 'segment',
          x: event.clientX,
          y: event.clientY
        })
      }
    }
  },
  
  'far+square': (event, setShapeState, prevShapeState) => {
    if (event.type === 'mousemove') {
      if (!prevShapeState.isShaping) {
        setShapeState({
          isShaping: true,
          shape: 'rectangle',
          x: event.clientX,
          y: event.clientY
        })
      }
    }
  },

  'far+circle': (event, setShapeState, prevShapeState) => {
    if (event.type === 'mousemove') {
      if (!prevShapeState.isShaping) {
        setShapeState({
          isShaping: true,
          shape: 'circle',
          x: event.clientX,
          y: event.clientY
        })
      }
    }
  },

  'fas+eye-dropper': (event) => {
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

      console.log(color)
    }
  },

  'fas+search': (event) => {
  
  },

  'none': () => {}
}

exports.tools = tools
exports.cursors = cursors
exports.behaviors = behaviors

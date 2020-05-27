const tools = [
  'pencil-alt',
  'eraser',
  'fill',
  'font',
  'eye-dropper',
  'search'
]

let c = document.createElement('canvas')
c.height = 32
c.width = 32
let ctx = c.getContext('2d')
ctx.fillStyle = '#fff'
ctx.strokeRect(0, 0, c.width, c.height)
ctx.fillRect(1, 1, c.width - 2, c.height - 2)
let dataURL = c.toDataURL()

const cursors = {
  'pencil-alt': 'cell',
  eraser: 'url("' + dataURL + '"), auto',
  fill: 'no-drop',
  font: 'text',
  'eye-dropper': 'alias',
  search: 'cell',
  'none': ''
}

const behaviors = {
  'pencil-alt': (event) => {
    let canvas = event.target
    let context = canvas.getContext('2d')
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
      context.moveTo(prevX, prevY, 2, 2)
      context.lineTo(x, y, 2, 2)
      context.stroke()
      context.closePath()
    }
  },

  eraser: (event) => {
    let canvas = event.target
    let context = canvas.getContext('2d')
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

  fill: (event) => {
    if (event.type === 'mousedown') {
      let canvas = event.target
      let context = canvas.getContext('2d')
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

  font: (event, setIsWriting) => {
    if (event.type === 'click') {
      setIsWriting(true)

      let canvas = event.target
      let context = canvas.getContext('2d')
      context.fillStyle = '#000'
      context.font = '2em Titillium Web'

      let textBlock = document.createElement('div')
      let textarea = document.createElement('textarea')
      textBlock.classList.add('text-block')
      textBlock.appendChild(textarea)
      document.getElementById('board-wrapper').appendChild(textBlock)

      textarea.cols = '7'
      textarea.rows = '1'

      let blockLeft = event.clientX
      let blockTop = event.clientY - textBlock.offsetHeight / 2
      let canvasRect = canvas.getBoundingClientRect()
      if (blockLeft < canvasRect.left) {
        blockLeft = canvasRect.left
      } else if (blockLeft + textBlock.offsetWidth > canvasRect.right) {
        blockLeft = canvasRect.right - textBlock.offsetWidth
      }

      if (blockTop < canvasRect.top) {
        blockTop = canvasRect.top
      } else if (blockTop + textBlock.offsetHeight > canvasRect.bottom) {
        blockTop = canvasRect.bottom - textBlock.offsetHeight
      }

      textBlock.style.left = blockLeft + 'px'
      textBlock.style.top = blockTop + 'px'
      textarea.addEventListener('mousedown', (event) => { event.stopPropagation() })

      // Drag and drop
      textBlock.addEventListener('mousedown', (event) => {
        let shiftX = event.clientX - textBlock.getBoundingClientRect().left
        let shiftY = event.clientY - textBlock.getBoundingClientRect().top

        function handleMouseMove(event) {
          let xPos = event.clientX - shiftX
          let yPos = event.clientY - shiftY
          if (xPos < canvasRect.left) {
            xPos = canvasRect.left
          } else if (xPos + textBlock.offsetWidth > canvasRect.right) {
            xPos = canvasRect.right - textBlock.offsetWidth
          }

          if (yPos < canvasRect.top) {
            yPos = canvasRect.top
          } else if (yPos + textBlock.offsetHeight > canvasRect.bottom) {
            yPos = canvasRect.bottom - textBlock.offsetHeight
          }

          textBlock.style.left = xPos + 'px'
          textBlock.style.top = yPos + 'px'
        }

        function handleMouseUp() {
          document.removeEventListener('mousemove', handleMouseMove)
          textBlock.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        textBlock.addEventListener('mouseup', handleMouseUp)
      })

      let rowHeight = textarea.offsetHeight / Number(textarea.rows)
      function drawText(event) {
        if (event.target === textBlock || textBlock.contains(event.target)) {
          return
        }

        setIsWriting(false)
        let text = textarea.value
        if (text !== '') {
          let textareaRect = textarea.getBoundingClientRect()
          let backupArea = context.getImageData(
            textareaRect.left - canvas.offsetLeft,
            textareaRect.bottom - canvas.offsetTop,
            textareaRect.width,
            canvas.height - (textareaRect.bottom - canvas.offsetTop))

          let inc = 32 / 8
          let blockWidth = textareaRect.width
          let xCoord = textareaRect.left - canvas.offsetLeft
          let yCoord = textareaRect.top - canvas.offsetTop - 3 * inc
          let currentText = ''
          let currentWidth = 0
          let counter = 1
          let spaceIndex = -1
          let i = 0
          for (let char of text) {
            if (char === ' ') {
              spaceIndex = i
            }

            if (char === '\n') {
              context.fillText(currentText, xCoord, yCoord + rowHeight * counter)
              currentWidth = 0
              counter++
              currentText = ''
              i = 0
              continue
            }

            currentWidth += context.measureText(char).width
            if (currentWidth <= blockWidth) {
              currentText += char
            } else {
              let textToDraw = currentText
              if (spaceIndex >= 0) {
                if (char === ' ') {
                  char = ''
                }

                textToDraw = textToDraw.slice(0, spaceIndex)
                currentText = currentText.slice(spaceIndex + 1,
                  currentText.length) + char
              } else {
                currentText = char
              }

              context.fillText(textToDraw, xCoord, yCoord + rowHeight * counter)

              currentWidth = context.measureText(currentText).width
              counter++
              spaceIndex = -1
              i = currentText.length
              continue
            }

            i++
          }

          if (currentText !== '') {
            context.fillText(currentText, xCoord, yCoord + rowHeight * counter)
          }

          context.putImageData(backupArea,
            textareaRect.left - canvas.offsetLeft,
            textareaRect.bottom - canvas.offsetTop)
        }

        textBlock.remove()
        document.removeEventListener('click', drawText)
      }

      document.addEventListener('click', drawText)
      textarea.focus()
    }
  },

  'eye-dropper': (event) => {
    if (event.type === 'mousedown') {
      let canvas = event.target
      let context = canvas.getContext('2d')
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

  search: () => {},
  'none': () => {}
}

exports.tools = tools
exports.cursors = cursors
exports.behaviors = behaviors

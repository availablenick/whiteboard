const behaviors = {
  top: (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousedown') {
      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        let textBlockBottom = textBlock.offsetTop + textBlock.offsetHeight
        newStyle.top = ''
        newStyle.bottom = (window.innerHeight - textBlockBottom) + 'px'
        return newStyle
      })

      return
    }

    let offsetBottom = textBlock.offsetTop + textBlock.offsetHeight
    let oldHeight = textBlock.offsetHeight
    let newHeight = offsetBottom - event.clientY
    if (newHeight < 25) {
      newHeight = 25
    }

    let heightDifference = newHeight - oldHeight
    if (textBlock.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = textBlock.offsetTop - canvas.offsetTop + oldHeight
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key of Object.keys(prevStyle)) {
        newStyle[key] = prevStyle[key]
      }

      newStyle.height = newHeight + 'px'
      return newStyle
    })
  },

  'top-right': (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousedown') {
      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        let textBlockBottom = textBlock.offsetTop + textBlock.offsetHeight
        newStyle.top = ''
        newStyle.bottom = (window.innerHeight - textBlockBottom) + 'px'
        return newStyle
      })

      return
    }

    let offsetBottom = textBlock.offsetTop + textBlock.offsetHeight
    let oldHeight = textBlock.offsetHeight
    let newHeight = offsetBottom - event.clientY
    if (newHeight < 25) {
      newHeight = 25
    }

    let heightDifference = newHeight - oldHeight
    if (textBlock.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = textBlock.offsetTop - canvas.offsetTop + oldHeight
    }

    let offsetRight = textBlock.offsetLeft + textBlock.offsetWidth
    let oldWidth = textBlock.offsetWidth
    let newWidth = event.clientX - textBlock.offsetLeft
    if (newWidth < 25) {
      newWidth = 25
    }

    let widthDifference = newWidth - oldWidth
    let canvasRight = canvas.offsetLeft + canvas.offsetWidth
    if (offsetRight + widthDifference > canvasRight) {
      newWidth = oldWidth + canvasRight - offsetRight
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key of Object.keys(prevStyle)) {
        newStyle[key] = prevStyle[key]
      }

      newStyle.height = newHeight + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  },

  right: (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousemove') {
      let offsetRight = textBlock.offsetLeft + textBlock.offsetWidth
      let oldWidth = textBlock.offsetWidth
      let newWidth = event.clientX - textBlock.offsetLeft
      if (newWidth < 25) {
        newWidth = 25
      }

      let widthDifference = newWidth - oldWidth
      let canvasRight = canvas.offsetLeft + canvas.offsetWidth
      if (offsetRight + widthDifference > canvasRight) {
        newWidth = oldWidth + canvasRight - offsetRight
      }

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.width = newWidth + 'px'
        return newStyle
      })
    }
  },

  'bottom-right': (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousemove') {
      let offsetBottom = textBlock.offsetTop + textBlock.offsetHeight
      let oldHeight = textBlock.offsetHeight
      let newHeight = event.clientY - textBlock.offsetTop
      if (newHeight < 25) {
        newHeight = 25
      }

      let heightDifference = newHeight - oldHeight
      let canvasBottom = canvas.offsetTop + canvas.offsetHeight
      if (offsetBottom + heightDifference > canvasBottom) {
        newHeight = oldHeight + canvasBottom - offsetBottom
      }

      let offsetRight = textBlock.offsetLeft + textBlock.offsetWidth
      let oldWidth = textBlock.offsetWidth
      let newWidth = event.clientX - textBlock.offsetLeft
      if (newWidth < 25) {
        newWidth = 25
      }

      let widthDifference = newWidth - oldWidth
      let canvasRight = canvas.offsetLeft + canvas.offsetWidth
      if (offsetRight + widthDifference > canvasRight) {
        newWidth = oldWidth + canvasRight - offsetRight
      }

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.height = newHeight + 'px'
        newStyle.width = newWidth + 'px'
        return newStyle
      })

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.height = newHeight + 'px'
        return newStyle
      })
    }
  },

  bottom: (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousemove') {
      let offsetBottom = textBlock.offsetTop + textBlock.offsetHeight
      let oldHeight = textBlock.offsetHeight
      let newHeight = event.clientY - textBlock.offsetTop
      if (newHeight < 25) {
        newHeight = 25
      }

      let heightDifference = newHeight - oldHeight
      let canvasBottom = canvas.offsetTop + canvas.offsetHeight
      if (offsetBottom + heightDifference > canvasBottom) {
        newHeight = oldHeight + canvasBottom - offsetBottom
      }

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.height = newHeight + 'px'
        return newStyle
      })
    }
  },

  'bottom-left': (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousedown') {
      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        let textBlockRight = textBlock.offsetLeft + textBlock.offsetWidth
        newStyle.left = ''
        newStyle.right = (window.innerWidth - textBlockRight) + 'px'
        return newStyle
      })

      return
    }

    let offsetBottom = textBlock.offsetTop + textBlock.offsetHeight
    let oldHeight = textBlock.offsetHeight
    let newHeight = event.clientY - textBlock.offsetTop
    if (newHeight < 25) {
      newHeight = 25
    }

    let heightDifference = newHeight - oldHeight
    let canvasBottom = canvas.offsetTop + canvas.offsetHeight
    if (offsetBottom + heightDifference > canvasBottom) {
      newHeight = oldHeight + canvasBottom - offsetBottom
    }

    let offsetRight = textBlock.offsetLeft + textBlock.offsetWidth
    let oldWidth = textBlock.offsetWidth
    let newWidth = offsetRight - event.clientX
    if (newWidth < 25) {
      newWidth = 25
    }

    let widthDifference = newWidth - oldWidth
    if (textBlock.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = textBlock.offsetLeft - canvas.offsetLeft + oldWidth
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key of Object.keys(prevStyle)) {
        newStyle[key] = prevStyle[key]
      }

      newStyle.height = newHeight + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  },

  left: (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousedown') {
      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        let textBlockRight = textBlock.offsetLeft + textBlock.offsetWidth
        newStyle.left = ''
        newStyle.right = (window.innerWidth - textBlockRight) + 'px'
        return newStyle
      })

      return
    }

    let offsetRight = textBlock.offsetLeft + textBlock.offsetWidth
    let oldWidth = textBlock.offsetWidth
    let newWidth = offsetRight - event.clientX
    if (newWidth < 25) {
      newWidth = 25
    }

    let widthDifference = newWidth - oldWidth
    if (textBlock.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = textBlock.offsetLeft - canvas.offsetLeft + oldWidth
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key of Object.keys(prevStyle)) {
        newStyle[key] = prevStyle[key]
      }

      newStyle.width = newWidth + 'px'
      return newStyle
    })
  },

  'top-left': (event, setStyle) => {
    const canvas = document.getElementsByTagName('canvas')[0]
    const textBlock = document.getElementsByClassName('text-block')[0]
    if (event.type === 'mousedown') {
      setStyle(prevStyle => {
        let newStyle = {}
        for (let key of Object.keys(prevStyle)) {
          newStyle[key] = prevStyle[key]
        }

        let textBlockBottom = textBlock.offsetTop + textBlock.offsetHeight
        let textBlockRight = textBlock.offsetLeft + textBlock.offsetWidth
        newStyle.top = ''
        newStyle.bottom = (window.innerHeight - textBlockBottom) + 'px'
        newStyle.left = ''
        newStyle.right = (window.innerWidth - textBlockRight) + 'px'
        return newStyle
      })

      return
    }

    let offsetBottom = textBlock.offsetTop + textBlock.offsetHeight
    let oldHeight = textBlock.offsetHeight
    let newHeight = offsetBottom - event.clientY
    if (newHeight < 25) {
      newHeight = 25
    }

    let heightDifference = newHeight - oldHeight
    if (textBlock.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = textBlock.offsetTop - canvas.offsetTop + oldHeight
    }

    let offsetRight = textBlock.offsetLeft + textBlock.offsetWidth
    let oldWidth = textBlock.offsetWidth
    let newWidth = offsetRight - event.clientX
    if (newWidth < 25) {
      newWidth = 25
    }

    let widthDifference = newWidth - oldWidth
    if (textBlock.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = textBlock.offsetLeft - canvas.offsetLeft + oldWidth
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key of Object.keys(prevStyle)) {
        newStyle[key] = prevStyle[key]
      }

      newStyle.height = newHeight + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  }
}

export default behaviors

const behaviors = {
  top: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    let offsetBottom = element.offsetTop + element.offsetHeight
    let oldHeight = element.offsetHeight
    let newHeight = offsetBottom - event.clientY
    if (newHeight < bound.height) {
      newHeight = bound.height
    }

    let heightDifference = newHeight - oldHeight
    if (element.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = element.offsetTop - canvas.offsetTop + oldHeight
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key in prevStyle) {
        newStyle[key] = prevStyle[key]
      }
      
      let elementBottom = element.offsetTop + element.offsetHeight
      newStyle.bottom = (window.innerHeight - elementBottom) + 'px'
      newStyle.top = ''
      newStyle.height = newHeight + 'px'
      return newStyle
    })
  },

  'top-right': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    let offsetBottom = element.offsetTop + element.offsetHeight
    let oldHeight = element.offsetHeight
    let newHeight = offsetBottom - event.clientY
    if (newHeight < bound.height) {
      newHeight = bound.height
    }

    let heightDifference = newHeight - oldHeight
    if (element.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = element.offsetTop - canvas.offsetTop + oldHeight
    }

    let offsetRight = element.offsetLeft + element.offsetWidth
    let oldWidth = element.offsetWidth
    let newWidth = event.clientX - element.offsetLeft
    if (newWidth < bound.width) {
      newWidth = bound.width
    }

    let widthDifference = newWidth - oldWidth
    let canvasRight = canvas.offsetLeft + canvas.offsetWidth
    if (offsetRight + widthDifference > canvasRight) {
      newWidth = oldWidth + canvasRight - offsetRight
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key in prevStyle) {
        newStyle[key] = prevStyle[key]
      }

      let elementBottom = element.offsetTop + element.offsetHeight
      newStyle.bottom = (window.innerHeight - elementBottom) + 'px'
      newStyle.left = element.offsetLeft + 'px'
      newStyle.right = ''
      newStyle.top = ''
      newStyle.height = newHeight + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  },

  right: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    if (event.type === 'mousemove') {
      let offsetRight = element.offsetLeft + element.offsetWidth
      let oldWidth = element.offsetWidth
      let newWidth = event.clientX - element.offsetLeft
      if (newWidth < bound.width) {
        newWidth = bound.width
      }

      let widthDifference = newWidth - oldWidth
      let canvasRight = canvas.offsetLeft + canvas.offsetWidth
      if (offsetRight + widthDifference > canvasRight) {
        newWidth = oldWidth + canvasRight - offsetRight
      }

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key in prevStyle) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.left = element.offsetLeft + 'px'
        newStyle.right = ''
        newStyle.width = newWidth + 'px'
        return newStyle
      })
    }
  },

  'bottom-right': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    if (event.type === 'mousemove') {
      let offsetBottom = element.offsetTop + element.offsetHeight
      let oldHeight = element.offsetHeight
      let newHeight = event.clientY - element.offsetTop
      if (newHeight < bound.height) {
        newHeight = bound.height
      }

      let heightDifference = newHeight - oldHeight
      let canvasBottom = canvas.offsetTop + canvas.offsetHeight
      if (offsetBottom + heightDifference > canvasBottom) {
        newHeight = oldHeight + canvasBottom - offsetBottom
      }

      let offsetRight = element.offsetLeft + element.offsetWidth
      let oldWidth = element.offsetWidth
      let newWidth = event.clientX - element.offsetLeft
      if (newWidth < bound.width) {
        newWidth = bound.width
      }

      let widthDifference = newWidth - oldWidth
      let canvasRight = canvas.offsetLeft + canvas.offsetWidth
      if (offsetRight + widthDifference > canvasRight) {
        newWidth = oldWidth + canvasRight - offsetRight
      }

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key in prevStyle) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.bottom = ''
        newStyle.left = element.offsetLeft + 'px';
        newStyle.right = ''
        newStyle.top = element.offsetTop + 'px';
        newStyle.height = newHeight + 'px'
        newStyle.width = newWidth + 'px'
        return newStyle
      })
    }
  },

  bottom: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    if (event.type === 'mousemove') {
      let offsetBottom = element.offsetTop + element.offsetHeight
      let oldHeight = element.offsetHeight
      let newHeight = event.clientY - element.offsetTop
      if (newHeight < bound.height) {
        newHeight = bound.height
      }

      let heightDifference = newHeight - oldHeight
      let canvasBottom = canvas.offsetTop + canvas.offsetHeight
      if (offsetBottom + heightDifference > canvasBottom) {
        newHeight = oldHeight + canvasBottom - offsetBottom
      }

      setStyle(prevStyle => {
        let newStyle = {}
        for (let key in prevStyle) {
          newStyle[key] = prevStyle[key]
        }

        newStyle.bottom = ''
        newStyle.top = element.offsetTop + 'px'
        newStyle.height = newHeight + 'px'
        return newStyle
      })
    }
  },

  'bottom-left': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    let offsetBottom = element.offsetTop + element.offsetHeight
    let oldHeight = element.offsetHeight
    let newHeight = event.clientY - element.offsetTop
    if (newHeight < bound.height) {
      newHeight = bound.height
    }

    let heightDifference = newHeight - oldHeight
    let canvasBottom = canvas.offsetTop + canvas.offsetHeight
    if (offsetBottom + heightDifference > canvasBottom) {
      newHeight = oldHeight + canvasBottom - offsetBottom
    }

    let offsetRight = element.offsetLeft + element.offsetWidth
    let oldWidth = element.offsetWidth
    let newWidth = offsetRight - event.clientX
    if (newWidth < bound.width) {
      newWidth = bound.width
    }

    let widthDifference = newWidth - oldWidth
    if (element.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = element.offsetLeft - canvas.offsetLeft + oldWidth
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key in prevStyle) {
        newStyle[key] = prevStyle[key]
      }

      let elementRight = element.offsetLeft + element.offsetWidth
      newStyle.bottom = ''
      newStyle.left = ''
      newStyle.right = (window.innerWidth - elementRight) + 'px'
      newStyle.top = element.offsetTop + 'px'
      newStyle.height = newHeight + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  },

  left: (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    let offsetRight = element.offsetLeft + element.offsetWidth
    let oldWidth = element.offsetWidth
    let newWidth = offsetRight - event.clientX
    if (newWidth < bound.width) {
      newWidth = bound.width
    }

    let widthDifference = newWidth - oldWidth
    if (element.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = element.offsetLeft - canvas.offsetLeft + oldWidth
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key in prevStyle) {
        newStyle[key] = prevStyle[key]
      }

      let elementRight = element.offsetLeft + element.offsetWidth
      newStyle.left = ''
      newStyle.right = (window.innerWidth - elementRight) + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  },

  'top-left': (event, element, setStyle, bound) => {
    const canvas = document.getElementById('canvas')
    let offsetBottom = element.offsetTop + element.offsetHeight
    let oldHeight = element.offsetHeight
    let newHeight = offsetBottom - event.clientY
    if (newHeight < bound.height) {
      newHeight = bound.height
    }

    let heightDifference = newHeight - oldHeight
    if (element.offsetTop - heightDifference < canvas.offsetTop) {
      newHeight = element.offsetTop - canvas.offsetTop + oldHeight
    }

    let offsetRight = element.offsetLeft + element.offsetWidth
    let oldWidth = element.offsetWidth
    let newWidth = offsetRight - event.clientX
    if (newWidth < bound.width) {
      newWidth = bound.width
    }

    let widthDifference = newWidth - oldWidth
    if (element.offsetLeft - widthDifference < canvas.offsetLeft) {
      newWidth = element.offsetLeft - canvas.offsetLeft + oldWidth
    }

    setStyle(prevStyle => {
      let newStyle = {}
      for (let key in prevStyle) {
        newStyle[key] = prevStyle[key]
      }

      let elementBottom = element.offsetTop + element.offsetHeight
      let elementRight = element.offsetLeft + element.offsetWidth
      newStyle.bottom = (window.innerHeight - elementBottom) + 'px'
      newStyle.left = ''
      newStyle.right = (window.innerWidth - elementRight) + 'px'
      newStyle.top = ''
      newStyle.height = newHeight + 'px'
      newStyle.width = newWidth + 'px'
      return newStyle
    })
  }
}

export default behaviors

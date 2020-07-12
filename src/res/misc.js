const misc = [
  'fas+broom',
  'fas+bars'
]

const behaviors = {
  'fas+broom': (event) => {
    event.stopPropagation()
    let canvas = document.getElementsByTagName('canvas')[0]
    let context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  },

  'fas+bars': () => {}
}

exports.misc = misc
exports.behaviors = behaviors

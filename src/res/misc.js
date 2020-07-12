const misc = [
  'broom',
  'bars',
]

const icons = {
  'broom': 'fas+broom',
  'bars': 'fas+bars'
}

const behaviors = {
  'broom': (event) => {
    event.stopPropagation()
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  },

  'bars': () => {}
}

exports.misc = misc
exports.icons = icons
exports.behaviors = behaviors

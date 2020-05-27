const helpers = [
  'broom',
  'bars'
]

const behaviors = {
  'broom': (event) => {
    event.stopPropagation()
    let canvas = document.getElementsByTagName('canvas')[0]
    let context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  },

  'bars': () => {}
}

exports.helpers = helpers
exports.behaviors = behaviors

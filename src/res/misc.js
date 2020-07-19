const misc = [
  'broom',
  'hide',
]

const icons = {
  'broom': 'fas+broom',
  'hide': 'fas+arrow-left'
}

const behaviors = {
  'broom': (event) => {
    event.stopPropagation()
    let canvas = document.getElementById('canvas')
    let context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
  },

  'hide': (event, params) => {
    event.stopPropagation()
    params.setIsSidebarVisible(false)
  }
}

exports.misc = misc
exports.icons = icons
exports.behaviors = behaviors

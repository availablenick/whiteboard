const getSliderColorFromPos = (yTotal) => {
  let [r, g, b] = [0, 0, 0]
  let amount = yTotal
  amount %= (1/6)
  if (Math.abs(amount) < 1.0e-10) {
    if (yTotal <= 1/6) {
      amount = 0
    } else {
      amount = 1/6
    }
  }

  if (yTotal <= 1/3) {
    b = 0
    if (yTotal <= 1/6) {
      r = 255
      g = Math.floor((amount / (1/6)) * 255)
    } else {
      r = 255 - Math.floor((amount / (1/6)) * 255)
      g = 255
    }
  } else if (1/3 < yTotal && yTotal <= 2/3) {
    r = 0
    if (yTotal <= 3/6) {
      g = 255
      b = Math.floor((amount / (1/6)) * 255)
    } else {
      g = 255 - Math.floor((amount / (1/6)) * 255)
      b = 255
    }
  } else {
    g = 0
    if (yTotal <= 5/6) {
      b = 255
      r = Math.floor((amount / (1/6)) * 255)
    } else {
      b = 255 - Math.floor((amount / (1/6)) * 255)
      r = 255
    }
  }

  return 'rgb(' + r + ', ' + g + ', ' + b + ')'
}

const getSliderPosFromColor = (color) => {
  let m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(color);
  let [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
  let yTotal = 0
  if (b === 0) {
    if (r > g) {
      yTotal = (g * (1/6)) / 255
    } else {
      yTotal = 1/6 + ((255 - r) * (1/6)) / 255
    }
  } else if (r === 0) {
    if (g > b) {
      yTotal = 2/6 + (b * (1/6)) / 255
    } else {
      yTotal = 3/6 + ((255 - g) * (1/6)) / 255
    }
  } else {
    if (b > r) {
      yTotal = 4/6 + (r * (1/6)) / 255
    } else {
      yTotal = 5/6 + ((255 - b) * (1/6)) / 255
    }
  }

  return yTotal
}

const getSelectorColorFromPos = (xTotal, yTotal, sliderColor) => {
  let m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(sliderColor);
  let [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
  r = Math.floor(((1 - xTotal) * (255 - r) + r) * (1 - yTotal))
  g = Math.floor(((1 - xTotal) * (255 - g) + g) * (1 - yTotal))
  b = Math.floor(((1 - xTotal) * (255 - b) + b) * (1 - yTotal))

  return [r, g, b]
}

const getSelectorPosFromColor = (color) => {
  let m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(color);
  let [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
  let greatest = Math.max(r, g, b)
  let smallest = Math.min(r, g, b)
  let yTotal = 1 - greatest / 255
  let xTotal = 0
  if (yTotal !== 1) {
    xTotal = 1 - smallest / (255 * (1 - yTotal))
  }

  return [xTotal, yTotal]
}

const getSliderColorFromSelectorColor = (color) => {
  let [xTotal, yTotal] = getSelectorPosFromColor(color)
  let m = /rgba?\((\d+), (\d+), (\d+)(, (\d+)(\.\d+)?)?\)/.exec(color);
  let [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])]
  let rSlider = 255
  let gSlider = 0
  let bSlider = 0
  if (xTotal !== 0) {
    rSlider = Math.floor(Math.abs((r / (1 - yTotal) - 255 * (1 - xTotal)) / xTotal))
    gSlider = Math.floor(Math.abs((g / (1 - yTotal) - 255 * (1 - xTotal)) / xTotal))
    bSlider = Math.floor(Math.abs((b / (1 - yTotal) - 255 * (1 - xTotal)) / xTotal))
  }

  return 'rgb(' + rSlider + ', ' + gSlider + ', ' + bSlider + ')'
}

exports.getSelectorColorFromPos = getSelectorColorFromPos
exports.getSelectorPosFromColor = getSelectorPosFromColor
exports.getSliderColorFromPos = getSliderColorFromPos
exports.getSliderColorFromSelectorColor = getSliderColorFromSelectorColor
exports.getSliderPosFromColor = getSliderPosFromColor

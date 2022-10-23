const eraser = {
  config: {},
  setConfig: () => {},
  getIcon() {
    return ['fas', 'eraser'];
  },
  getCursor() {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d');
    canvas.width = this.config.eraser.size;
    canvas.height = this.config.eraser.size;
    context.fillStyle = this.config.erasing.color;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
    let dataURL = canvas.toDataURL();

    return `url("${dataURL}"), auto`;
  },
  executeAction(event) {
    if (event.type === 'keydown' && event.shiftKey && !event.ctrlKey) {
      setNewSize(event, this.config.eraser.size, this.config, this.setConfig);
      return;
    }

    const canvas = event.target;
    const context = canvas.getContext('2d');
    context.fillStyle = this.config.erasing.color;
    context.strokeStyle = this.config.erasing.color;

    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    let previousX = x - event.movementX;
    let previousY = y - event.movementY;

    const NO_BUTTON = 0;
    if (event.type === 'mousedown' && event.button === NO_BUTTON) {
      context.fillRect(x, y-1, this.config.eraser.size, this.config.eraser.size);
      return;
    }

    const LEFT_BUTTON = 1;
    if (event.type === 'mousemove' && event.buttons === LEFT_BUTTON) {
      if (x === previousX) {
        fillVerticalPath(x, previousY, y, this.config.eraser.size, context);
      } else {
        fillDiagonalPath(previousX, previousY, x, y, this.config.eraser.size, context);
      }
    }
  },
};

export default eraser;

function setNewSize(event, size, config, setConfig) {
  const UPPER_BOUND = 48;
  const LOWER_BOUND = 4;
  let newsize = size;
  if (event.key === '+') {
    newsize = size + 1 > UPPER_BOUND ? UPPER_BOUND : size + 1;
  } else if (event.key === '-') {
    newsize = size - 1 < LOWER_BOUND ? LOWER_BOUND : size - 1;
  }

  setConfig({
    ...config,
    eraser: { size: newsize },
  });
}

function fillVerticalPath(x, sourceY, destY, size, context) {
  let currentY = sourceY;
  while (currentY !== destY) {
    currentY = sourceY < destY ? currentY + 1 : currentY - 1;
    context.fillRect(x, currentY-1, size, size);
  }
};

function fillDiagonalPath(sourceX, sourceY, destX, destY, size, context) {
  let slope = (destY - sourceY) / (destX - sourceX);
  let currentX = sourceX;
  let lastY = sourceY;
  while (!destXWasReached(sourceX, destX, currentX)) {
    let currentY = slope * (currentX - destX) + destY;
    context.fillRect(currentX, currentY-1, size-1, size);
    let lastX = currentX;
    currentX = sourceX < destX ? currentX + 1 : currentX - 1;

    if (lastY !== currentY) {
      let auxY = lastY;
      while (!destYWasReached(lastY, currentY, auxY)) {
        context.fillRect(lastX-1, auxY-1, size, size);
        auxY = lastY < currentY ? auxY + 1 : auxY - 1;
      }

      lastY = currentY;
    }
  }
};

function destXWasReached(sourceX, destX, currentX) {
  return (sourceX < destX && currentX > destX + 1) ||
         (sourceX >= destX && currentX < destX - 1);
}

function destYWasReached(sourceY, destY, currentY) {
  return (sourceY < destY && currentY >= destY - 1) ||
         (sourceY >= destY && currentY <= destY + 1);
}

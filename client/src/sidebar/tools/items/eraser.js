import createCanvasChangeEvent from '../../../global/helpers';

function getIcon() {
  return ['fas', 'eraser'];
}

function getCursor(config) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = config.eraser.size;
  canvas.height = config.eraser.size;
  context.fillStyle = config.erasing.color;
  context.strokeRect(0, 0, canvas.width, canvas.height);
  context.fillRect(1, 1, canvas.width - 2, canvas.height - 2);
  const dataURL = canvas.toDataURL();

  return `url("${dataURL}"), auto`;
}

function executeAction(event, config, setConfig) {
  if (event.type === 'keydown' && event.shiftKey && !event.ctrlKey) {
    setConfig({
      ...config,
      eraser: { size: calculateNewSize(event, config.eraser.size) },
    });

    return;
  }

  const canvas = event.target;
  const context = canvas.getContext('2d');
  context.fillStyle = config.erasing.color;
  context.strokeStyle = config.erasing.color;

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const previousX = x - event.movementX;
  const previousY = y - event.movementY;

  const NO_BUTTON = 0;
  if (event.type === 'mousedown' && event.button === NO_BUTTON) {
    context.fillRect(x, y - 1, config.eraser.size, config.eraser.size);
    canvas.dispatchEvent(createCanvasChangeEvent());
    return;
  }

  const LEFT_BUTTON = 1;
  if (event.type === 'mousemove' && event.buttons === LEFT_BUTTON) {
    if (x === previousX) {
      fillVerticalPath(x, previousY, y, config.eraser.size, context);
    } else {
      fillDiagonalPath(previousX, previousY, x, y, config.eraser.size, context);
    }

    canvas.dispatchEvent(createCanvasChangeEvent());
  }
}

function calculateNewSize(event, currentSize) {
  const UPPER_BOUND = 48;
  const LOWER_BOUND = 4;
  let newSize = currentSize;
  if (event.key === '+') {
    newSize = currentSize + 1 > UPPER_BOUND ? UPPER_BOUND : currentSize + 1;
  } else if (event.key === '-') {
    newSize = currentSize - 1 < LOWER_BOUND ? LOWER_BOUND : currentSize - 1;
  }

  return newSize;
}

function fillVerticalPath(x, sourceY, destY, size, context) {
  let currentY = sourceY;
  while (currentY !== destY) {
    currentY = sourceY < destY ? currentY + 1 : currentY - 1;
    context.fillRect(x, currentY - 1, size, size);
  }
}

function fillDiagonalPath(sourceX, sourceY, destX, destY, size, context) {
  const slope = (destY - sourceY) / (destX - sourceX);
  let currentX = sourceX;
  let lastY = sourceY;
  while (!destXWasReached(sourceX, destX, currentX)) {
    const currentY = slope * (currentX - destX) + destY;
    context.fillRect(currentX, currentY - 1, size - 1, size);
    const lastX = currentX;
    currentX = sourceX < destX ? currentX + 1 : currentX - 1;

    if (lastY !== currentY) {
      let auxY = lastY;
      while (!destYWasReached(lastY, currentY, auxY)) {
        context.fillRect(lastX - 1, auxY - 1, size, size);
        auxY = lastY < currentY ? auxY + 1 : auxY - 1;
      }

      lastY = currentY;
    }
  }
}

function destXWasReached(sourceX, destX, currentX) {
  return (sourceX < destX && currentX > destX + 1)
         || (sourceX >= destX && currentX < destX - 1);
}

function destYWasReached(sourceY, destY, currentY) {
  return (sourceY < destY && currentY >= destY - 1)
         || (sourceY >= destY && currentY <= destY + 1);
}

export default {
  getIcon,
  getCursor,
  executeAction,
};

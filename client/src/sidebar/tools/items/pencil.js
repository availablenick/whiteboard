import createCanvasChangeEvent from '../../../global/helpers';
import getIconFromCanvas from '../helpers';

function getIcon() {
  return ['fas', 'pencil-alt'];
}

function getCursor() {
  return getIconFromCanvas('\uf303', 2, 21);
}

function executeAction(event, color) {
  const canvas = event.target;
  const context = canvas.getContext('2d');
  context.fillStyle = color;
  context.strokeStyle = color;

  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  const previousX = x - event.movementX;
  const previousY = y - event.movementY;

  const NO_BUTTON = 0;
  if (event.type === 'mousedown' && event.button === NO_BUTTON) {
    context.fillRect(x - 1, y - 1, 2, 2);
    canvas.dispatchEvent(createCanvasChangeEvent());
    return;
  }

  const LEFT_BUTTON = 1;
  if (event.type === 'mousemove' && event.buttons === LEFT_BUTTON) {
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(previousX, previousY);
    context.lineTo(x, y);
    context.stroke();
    context.closePath();
    canvas.dispatchEvent(createCanvasChangeEvent());
  }
}

export default {
  getIcon,
  getCursor,
  executeAction,
};

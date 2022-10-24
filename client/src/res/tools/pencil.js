import { createCanvasChangeEvent, getIconFromCanvas } from '../helpers';

const pencil = {
  color: '',
  getIcon() {
    return ['fas', 'pencil-alt'];
  },
  getCursor() {
    return getIconFromCanvas('\uf303', 2, 21);
  },
  executeAction(event) {
    const canvas = event.target;
    const context = canvas.getContext('2d');
    context.fillStyle = this.color;
    context.strokeStyle = this.color;

    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    let previousX = x - event.movementX;
    let previousY = y - event.movementY;

    const NO_BUTTON = 0;
    if (event.type === 'mousedown' && event.button === NO_BUTTON) {
      context.fillRect(x-1, y-1, 2, 2);
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
  },
};

export default pencil;

import createCanvasChangeEvent from '../../../global/helpers';

function getIcon() {
  return ['fas', 'broom'];
}

function executeAction(event) {
  event.stopPropagation();
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  canvas.dispatchEvent(createCanvasChangeEvent());
}

export default {
  getIcon,
  executeAction,
};

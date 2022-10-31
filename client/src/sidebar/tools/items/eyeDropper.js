import getIconFromCanvas from '../helpers';

function getIcon() {
  return ['fas', 'eye-dropper'];
}

function getCursor() {
  return getIconFromCanvas('\uf1fb', 2, 21);
}

function executeAction(event, setConfig) {
  const NO_BUTTON = 0;
  if (event.type === 'mousedown' && event.button === NO_BUTTON) {
    const canvas = event.target;
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;
    const pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${(pixelData[3] / 255)})`;
    setConfig((prevConfig) => ({
      ...prevConfig,
      drawing: { color },
    }));
  }
}

export default {
  getIcon,
  getCursor,
  executeAction,
};

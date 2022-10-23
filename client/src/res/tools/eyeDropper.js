import { getIconFromCanvas } from './helpers';

const eyeDropper = {
  setConfig: () => {},
  getIcon() {
    return ['fas', 'eye-dropper'];
  },
  getCursor() {
    return getIconFromCanvas('\uf1fb', 2, 21);
  },
  executeAction(event) {
    const NO_BUTTON = 0;
    if (event.type === 'mousedown' && event.button === NO_BUTTON) {
      const canvas = event.target;
      let x = event.clientX - canvas.offsetLeft;
      let y = event.clientY - canvas.offsetTop;
      let pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
      let color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${(pixelData[3] / 255)})`;
      this.setConfig(prevConfig => {
        return {
          ...prevConfig,
          drawing: { color: color },
        };
      });
    }
  },
};

export default eyeDropper;

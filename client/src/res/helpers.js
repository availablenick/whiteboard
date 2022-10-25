function getIconFromCanvas(iconCode, x, y) {
  const canvasSize = 24;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  context.fillStyle = '#000';
  context.font = `900 ${(canvasSize - 4)}px "Font Awesome 5 Free"`;
  context.shadowBlur = '1';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('', 0, 0);

  return new Promise((resolve) => {
    document.fonts.ready.then(() => {
      context.fillText(iconCode, canvasSize / 2, canvasSize / 2);
      const dataURL = canvas.toDataURL();
      resolve(`url("${dataURL}") ${x} ${y}, auto`);
    });
  });
}

function createCanvasChangeEvent() {
  return new CustomEvent('canvas-change');
}

export {
  createCanvasChangeEvent,
  getIconFromCanvas,
};

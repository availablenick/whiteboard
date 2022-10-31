function createIcon(iconCode, x, y, configureCanvasContext = () => {}) {
  const canvasSize = 24;
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  context.translate(canvasSize / 2, canvasSize / 2);
  context.font = `900 ${(canvasSize - 4)}px "Font Awesome 5 Free"`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  configureCanvasContext(context);
  context.fillText('', 0, 0); // start font loading

  return new Promise((resolve) => {
    document.fonts.ready.then(() => {
      context.fillText(iconCode, 0, 0);
      const dataURL = canvas.toDataURL();
      resolve(`url("${dataURL}") ${x} ${y}, auto`);
    });
  });
}

export default createIcon;

function resize(event, measurements, setStyle, heightLowerBound, widthLowerBound) {
  const canvas = document.getElementById('canvas');
  const offsetBottom = measurements.offsetTop + measurements.offsetHeight;
  const oldHeight = measurements.offsetHeight;
  let newHeight = offsetBottom - event.clientY;
  if (newHeight < heightLowerBound) {
    newHeight = heightLowerBound;
  }

  const heightDifference = newHeight - oldHeight;
  if (measurements.offsetTop - heightDifference < canvas.offsetTop) {
    newHeight = measurements.offsetTop - canvas.offsetTop + oldHeight;
  }

  const offsetRight = measurements.offsetLeft + measurements.offsetWidth;
  const oldWidth = measurements.offsetWidth;
  let newWidth = event.clientX - measurements.offsetLeft;
  if (newWidth < widthLowerBound) {
    newWidth = widthLowerBound;
  }

  const widthDifference = newWidth - oldWidth;
  const canvasRight = canvas.offsetLeft + canvas.offsetWidth;
  if (offsetRight + widthDifference > canvasRight) {
    newWidth = oldWidth + canvasRight - offsetRight;
  }

  setStyle((prevStyle) => {
    const newStyle = {};
    Object.keys(prevStyle).forEach((key) => {
      newStyle[key] = prevStyle[key];
    });

    const elementBottom = measurements.offsetTop + measurements.offsetHeight;
    newStyle.bottom = `${window.innerHeight - elementBottom}px`;
    newStyle.left = `${measurements.offsetLeft}px`;
    newStyle.right = '';
    newStyle.top = '';
    newStyle.height = `${newHeight}px`;
    newStyle.width = `${newWidth}px`;
    return newStyle;
  });
}

export default resize;

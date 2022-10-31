function resize(event, measurements, setStyle, heightLowerBound, widthLowerBound) {
  const canvas = document.getElementById('canvas');
  if (event.type === 'mousemove') {
    const offsetBottom = measurements.offsetTop + measurements.offsetHeight;
    const oldHeight = measurements.offsetHeight;
    let newHeight = event.clientY - measurements.offsetTop;
    if (newHeight < heightLowerBound) {
      newHeight = heightLowerBound;
    }

    const heightDifference = newHeight - oldHeight;
    const canvasBottom = canvas.offsetTop + canvas.offsetHeight;
    if (offsetBottom + heightDifference > canvasBottom) {
      newHeight = oldHeight + canvasBottom - offsetBottom;
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

      newStyle.bottom = '';
      newStyle.left = `${measurements.offsetLeft}px`;
      newStyle.right = '';
      newStyle.top = `${measurements.offsetTop}px`;
      newStyle.height = `${newHeight}px`;
      newStyle.width = `${newWidth}px`;
      return newStyle;
    });
  }
}

export default resize;
